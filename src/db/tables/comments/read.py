import logging
from typing import Optional, List

from ...core import DbCore

from .base import Comment
from .params import CommentParams


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def read(
    filters: Optional[CommentParams] = None,
) -> List[Comment]:
    logger.info(f"Listing Comments with filters: {filters}")
    from ..query_builder import QueryBuilder

    builder = QueryBuilder(Comment, filters)
    builder.build_full()
    query = builder.query
    params = tuple(builder.args)
    logger.debug("Comment Read Query: %s \n Params: %s", query, params)
    return core.run_list(query, params, Comment)
