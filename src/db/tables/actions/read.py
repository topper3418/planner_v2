import logging
from typing import Optional

from pydantic import BaseModel

from ...core import DbCore

from .base import Action
from .params import ActionParams


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


class ReadActionsResponse(BaseModel):
    data: list[Action]
    count: int


def read_actions(
    query_params: Optional[ActionParams] = None,
) -> ReadActionsResponse:
    logger.debug(f"Listing actions with filters: {query_params}")
    from ..query_builder import QueryBuilder

    print("query_params:", query_params)
    builder = QueryBuilder(Action, query_params)
    builder.build_full()
    query = builder.query
    print("QUERY:", query)
    count_query = builder.count_query
    params = tuple(builder.args)
    logger.debug("Action Read Query: %s \n Args: %s", query, params)
    actions = core.run_list(query, tuple(params), Action.from_row)
    count = core.run_scalar(count_query, tuple(params))
    logger.debug("Total actions found: %d", count)
    return ReadActionsResponse(data=actions, count=count)
