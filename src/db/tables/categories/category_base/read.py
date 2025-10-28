from typing import Optional, List

from pydantic import BaseModel

from ....core import DbCore

from .base import Category
from .params import CategoryParams


class ReadCategoriesResponse(BaseModel):
    data: List[Category]
    count: int


def read(
    cls,
    filters: Optional[CategoryParams] = None,
) -> ReadCategoriesResponse:
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
    count_query = builder.count_query

    categories = core.run_list(query, tuple(params), Category)
    count = core.run_scalar(count_query, tuple(params))
    cls.__logger__.debug(f"Total {cls.__class__}s found: {count}")
    return ReadCategoriesResponse(data=categories, count=count)
