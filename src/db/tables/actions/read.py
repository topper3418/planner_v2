import logging
from typing import Optional

from ...core import DbCore

from .base import Action
from .params import ActionParams


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def read_actions(
    query_params: Optional[ActionParams] = None,
) -> list[Action]:
    logger.debug(f"Listing actions with filters: {query_params}")
    from ..query_builder import QueryBuilder

    builder = QueryBuilder(Action, query_params)
    builder.build_full()
    query = builder.query
    params = tuple(builder.args)
    logger.debug("Action Read Query: %s \n Args: %s", query, params)
    return core.run_list(query, tuple(params), Action.from_row)
