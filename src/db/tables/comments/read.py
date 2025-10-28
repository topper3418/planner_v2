import logging
from typing import Optional, List

from pydantic import BaseModel

from ...core import DbCore

from .base import Comment
from .params import CommentParams


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


class ReadCommentsResponse(BaseModel):
    data: List[Comment]
    count: int


def read(
    filters: Optional[CommentParams] = None,
) -> ReadCommentsResponse:
    logger.info(f"Listing Comments with filters: {filters}")
    from ..query_builder import QueryBuilder

    builder = QueryBuilder(Comment, filters)
    builder.build_full()
    query = builder.query
    params = tuple(builder.args)
    count_query = builder.count_query
    logger.debug("Comment Read Query: %s \n Params: %s", query, params)
    comments = core.run_list(query, params, Comment)
    count = core.run_scalar(count_query, params)
    logger.info(f"Total comments found: {count}")
    return ReadCommentsResponse(data=comments, count=count)
