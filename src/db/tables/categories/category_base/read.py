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
    from ...query_builder import QueryBuilder

    core = DbCore()
    core.logger = cls.__logger__
    builder = QueryBuilder(cls, filters)
    builder.build_full()
    query = builder.query
    params = tuple(builder.args)

    return core.run_list(query, tuple(params), Category)
