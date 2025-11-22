from typing import Optional, Type
import logging

from .query_params import QueryParams
from .table_model import TableModel
from .table_directory import table_directory


logger = logging.getLogger(__name__)


class QueryBuilder:
    """A class initialized with a table model that dynamically builds SQL queries."""

    def __init__(
        self,
        table_model: Type[TableModel],
        query_params: Optional[QueryParams] = None,
    ):
        self.table_model = table_model
        self.query_params = query_params
        self.select: list[str] = []
        self.join: list[str] = []
        self.where: list[str] = []
        self.pagination: str = ""
        self.args: list = []

    def build_full(self) -> None:
        """Builds the SQL query components."""
        self.add_full_select()
        self.add_join()
        self.add_where()
        self.add_pagination()

    @property
    def query(self) -> str:
        """Constructs the full SQL query."""
        query = "SELECT "
        query += ", ".join(self.select) if self.select else "*"
        query += f"\nFROM {self.table_model.__table_name__}"
        if self.join:
            query += " ".join(self.join) + " "
        if self.where:
            query += "\nWHERE " + "\n  AND ".join(self.where)
        if self.pagination:
            query += self.pagination
        query += ";"
        return query.strip()

    @property
    def count_query(self) -> str:
        """Constructs a SQL count query."""
        query = f"SELECT COUNT(*) FROM {self.table_model.__table_name__} "
        if self.join:
            query += " ".join(self.join) + " "
        if self.where:
            query += "WHERE " + " AND ".join(self.where)
        return query.strip()

    def add_full_select(self) -> None:
        """Adds all columns from the main table and optionally from related tables."""
        if self.query_params:
            # getattr is safer, not all params will have include
            include = getattr(self.query_params, "include", [])
        else:
            include = []
        # add the main table columns as table_name.field_name
        for field_name in self.table_model.get_column_fields().keys():
            # print(f"Adding column field: {field_name}")
            self.select.append(
                f"\n   {self.table_model.__table_name__}.{field_name}"
            )
        # if there is no include, early return
        if not include:
            return
        # add the included table columns as table_name.{table_name}_field_name
        relationship_fields = self.table_model.get_relationship_fields()
        for model_str in include:
            # children will be handled separately
            if model_str == "children":
                continue
            # things that end with _count will be handled separately
            if model_str.endswith("_count"):
                continue
            # get the relationship field that corresponds to this include
            relationship_field = relationship_fields.get(model_str)
            if not relationship_field:
                raise ValueError(
                    f"Include '{model_str}' not found in relationship fields for {self.table_model.__table_name__}"
                )
            # get the table model from that field
            related_model = relationship_field.json_schema_extra[
                "table_model"
            ]
            related_model = table_directory.get(related_model)
            if related_model is None:
                raise ValueError(
                    f"Related model '{model_str}' not found in table directory"
                )
            # get the keys and append them to the select
            for field_name in related_model.get_column_fields(
                exclude_pk=True
            ).keys():
                self.select.append(
                    f"\n   {related_model.__table_name__}.{field_name} AS {model_str}_{field_name}"
                )

    def add_join(self) -> None:
        """Adds JOIN clauses for related tables."""
        if self.query_params:
            include = getattr(self.query_params, "include", [])
        else:
            include = []
        # get foreign key columns and relationship fields
        foreign_key_fields = self.table_model.get_foreign_key_fields()
        relationship_fields = self.table_model.get_relationship_fields()
        # loop through include and add joins
        for include_str in include:
            # children will be handled separately
            if include_str == "children":
                continue
            # things that end with _count will be handled separately
            if include_str.endswith("_count"):
                continue
            # get the relationship field that corresponds to this include
            relationship_field = relationship_fields.get(include_str)
            if not relationship_field:
                raise ValueError(
                    f"Include '{include_str}' not found in relationship fields for {self.table_model.__table_name__}"
                )
            # get the foreign key field that corresponds to this include
            foreign_key = f"{include_str}_id"
            foreign_key_field = foreign_key_fields.get(foreign_key)
            if not foreign_key_field:
                raise ValueError(
                    f"Foreign key field for include '{include_str}' not found in {self.table_model.__table_name__}"
                )
            # get the table model from that field
            related_model = relationship_field.json_schema_extra[
                "table_model"
            ]
            related_model = table_directory.get(related_model)
            if related_model is None:
                raise ValueError(
                    f"Related model '{include_str}' not found in table directory"
                )
            # construct the join clause
            join_clause = (
                f"\nLEFT JOIN {related_model.__table_name__} "
                f"ON {self.table_model.__table_name__}.{foreign_key} "
                f"= {related_model.__table_name__}.{foreign_key_field.json_schema_extra['on']}"
            )
            self.join.append(join_clause)

    def add_where(self) -> None:
        """Adds WHERE conditions to the query."""
        if not self.query_params:
            return
        # get the filterable fields from the params
        filter_params = self.query_params.get_filter_params()
        # loop through them and add to where clause
        # as well as the args
        for field_name, filter_param in filter_params.items():
            value = getattr(self.query_params, field_name)
            # if there's a special case, handle that if the value matches
            if special_case := filter_param.json_schema_extra.get(
                "special_case"
            ):
                print("special case detected:", special_case)
                match_value, special_where = special_case
                if value == match_value:
                    self.where.append(special_where)
                    continue
            if value is None:
                continue
            if template := filter_param.json_schema_extra.get("template"):
                logger.info(
                    f"Rendering arg for field {field_name}: {value}"
                )
                value = template.format(
                    *[value]
                    * filter_param.json_schema_extra.get("repeat_arg", 1)
                )
            if isinstance(value, list):
                placeholders = ", ".join("?" * len(value))
                where_clause = filter_param.json_schema_extra[
                    "where_clause"
                ].format(placeholders)
                self.where.append(where_clause)
                self.args.extend(value)
            else:
                self.where.append(
                    filter_param.json_schema_extra["where_clause"]
                )
                args = [value] * filter_param.json_schema_extra.get(
                    "repeat_arg", 1
                )
                self.args.extend(args)

    def add_pagination(self) -> None:
        """Adds pagination to the query."""
        if not self.query_params:
            return
        page_number = getattr(self.query_params, "page_number", None)
        page_size = getattr(self.query_params, "page_size", None)
        if page_number is not None and page_size is not None:
            offset = (page_number - 1) * page_size
            pagination_clause = f"\nLIMIT {page_size} OFFSET {offset}"
            self.pagination = pagination_clause
