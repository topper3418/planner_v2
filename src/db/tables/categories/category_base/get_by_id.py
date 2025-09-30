from typing import Optional

from ....core import DbCore

from .base import Category


def get_by_id(cls, category_id: int) -> Optional[Category]:
    cls.__logger__.info(f"Fetching {cls.__class__} with ID {category_id}")
    query = f"SELECT * FROM {cls.__table_name__} WHERE id = ?"
    return DbCore.run_get_by_id(query, category_id, Category)
