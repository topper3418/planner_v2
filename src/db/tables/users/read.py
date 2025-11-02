import logging
from typing import Optional, List

from pydantic import BaseModel

from ...core import DbCore

from .base import User
from .params import UserParams


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


class ReadUsersResponse(BaseModel):
    data: List[User]
    count: int


def read(
    filters: Optional[UserParams] = None,
) -> ReadUsersResponse:
    logger.info(f"Listing Users with filters: {filters}")
    from ..query_builder import QueryBuilder

    builder = QueryBuilder(User, filters)
    builder.build_full()
    query = builder.query
    params = tuple(builder.args)
    count_query = builder.count_query
    logger.debug("User Read Query: %s \n Params: %s", query, params)
    comments = core.run_list(query, params, User)
    count = core.run_scalar(count_query, params)
    logger.info(f"Total user found: {count}")
    return ReadUsersResponse(data=comments, count=count)
