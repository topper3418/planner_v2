import logging
from typing import Optional, List

from ...core import DbCore

from .base import Thing
from .params import ThingParams


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def read(
    query_params: Optional[ThingParams] = None,
) -> List[Thing]:
    logger.info(f"Listing Things with params: {query_params}")
    from ..query_builder import QueryBuilder

    builder = QueryBuilder(Thing, query_params)
    builder.build_full()
    query = builder.query
    params = tuple(builder.args)
    logger.debug("Thing Read Query: %s \n Params: %s", query, params)
    things = core.run_list(query, params, Thing.from_row)
    if query_params and "children" in query_params.include:
        for thing in things:
            thing.populate_children()
    return things
