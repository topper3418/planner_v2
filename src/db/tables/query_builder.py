from typing import TYPE_CHECKING
import logging


logger = logging.getLogger(__name__)


if TYPE_CHECKING:
    from .table_model import TableModel


class QueryBuilder:
    """A class initialized with a table model that dynamically builds SQL queries."""

    def __init__(self, table_model: TableModel):
        self.table_model = table_model
        self.select: list[str] = []
        self.join: list[str] = []
        self.where: list[str] = []

    @property
    def query(self) -> str:
        """Constructs the full SQL query."""
        query = "SELECT "
        query += ", ".join(self.select) if self.select else "*"
        query += f" FROM {self.table_model.__table_name__} "
        if self.join:
            query += " ".join(self.join) + " "
        if self.where:
            query += "WHERE " + " AND ".join(self.where)
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

    def add_full_select(self, include: list[str] = []) -> None:
        """Adds all columns from the main table and optionally from related tables."""
        # add the main table columns as table_name.field_name
        for field_name in self.table_model.orm_fields.keys():
            self.select.append(
                f"{self.table_model.__table_name__}.{field_name}"
            )
        # if there is no include, early return
        if not include:
            return
        # add the included table columns as table_name.{table_name}_field_name
        relationship_fields = self.table_model.relationship_fields
        for model_str in include:
            # children will be handled separately
            if model_str == "children":
                continue
            # get the relationship field that corresponds to this include
            relationship_field = relationship_fields.get(model_str)
            if not relationship_field:
                raise ValueError(
                    f"Include '{model_str}' not found in relationship fields for {self.table_model.__table_name__}"
                )
            # get the table model from that field
            related_model = relationship_field.table_model
            # get the keys and append them to the select
            for field_name in related_model.orm_fields.keys():
                self.select.append(
                    f"{related_model.__table_name__}.{field_name} AS {related_model.__table_name__}_{field_name}"
                )

    def add_join(self, include: list[TableModel] = []) -> None:
        """Adds JOIN clauses for related tables."""
        # get foreign key columns and relationship fields
        foreign_key_fields = self.table_model.foreign_key_fields
        relationship_fields = self.table_model.relationship_fields
        # loop through include and add joins
        for model_str in include:
            # children will be handled separately
            if model_str == "children":
                continue
            # get the relationship field that corresponds to this include
            relationship_field = relationship_fields.get(model_str)
            if not relationship_field:
                raise ValueError(
                    f"Include '{model_str}' not found in relationship fields for {self.table_model.__table_name__}"
                )
            # get the foreign key field that corresponds to this include
            foreign_key_field = foreign_key_fields.get(f"{model_str}_id")
            if not foreign_key_field:
                raise ValueError(
                    f"Foreign key field for include '{model_str}' not found in {self.table_model.__table_name__}"
                )
            # get the table model from that field
            related_model = relationship_field.table_model
            # construct the join clause
            join_clause = (
                f"LEFT JOIN {related_model.__table_name__} "
                f"ON {self.table_model.__table_name__}.{foreign_key_field.name} "
                f"= {related_model.__table_name__}.{foreign_key_field.on}"
            )
            self.join.append(join_clause)

    def add_where(self, conditions: list[str] = []) -> None:
        """Adds WHERE conditions to the query."""
        for condition in conditions:
            self.where.append(condition)
