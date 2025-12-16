from typing import Type
import logging

from ..table_model import TableModel


logger = logging.getLogger(__name__)


def get_insert_query(table_model: Type[TableModel]) -> tuple[str, tuple]:
    """Constructs the full SQL insert query."""
    columns = []
    placeholders = []
    values = ()
    for field_name, field in table_model.get_column_fields(
        exclude_pk=True
    ).items():
        value = getattr(table_model, field_name)
        if value is None and not field.json_schema_extra.get(
            "nullable", True
        ):
            raise ValueError(f"Field '{field_name}' cannot be None")
        if value is not None:
            columns.append(field_name)
            placeholders.append("?")
            values += (value,)
    columns_str = ", ".join(columns)
    placeholders_str = ", ".join(placeholders)
    query = f"INSERT INTO {table_model.__table_name__} ({columns_str}) VALUES ({placeholders_str});"
    return query, values
