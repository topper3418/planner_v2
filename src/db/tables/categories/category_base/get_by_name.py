from typing import Optional

from ....core import DbCore

from .base import Category


def get_by_name(cls, name: str) -> Optional[Category]:
    cls.__logger__.info(f"Fetching {cls.__class__} with name {name}")
    core = DbCore()
    core.logger = cls.__logger__
    query = f"SELECT * FROM {cls.__table_name__} WHERE name = ?"
    return core.run_get_by_id(query, name, Category)
