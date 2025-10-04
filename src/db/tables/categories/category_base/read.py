from typing import Optional, List

from ....core import DbCore

from .base import Category
from .params import CategoryParams


def read(
    cls,
    filters: Optional[CategoryParams] = None,
) -> List[Category]:
    cls.__logger__.info(
        f"Listing {cls.__class__}s with filters: {filters}"
    )
    core = DbCore()
    core.logger = cls.__logger__
    query = f"SELECT c.* FROM {cls.__table_name__} c WHERE name LIKE ?"
    params = [f"%{filters.name if filters and filters.name else ''}%"]

    if filters and filters.search is not None:
        query += " AND (c.name LIKE ? OR c.description LIKE ?)"
        search_param = f"%{filters.search}%"
        params.extend([search_param, search_param])

    return core.run_list(query, tuple(params), Category)
