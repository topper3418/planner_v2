import logging
from typing import Optional, List

from pydantic import BaseModel

from ...core import DbCore

from .base import Milestone
from .params import MilestoneParams


logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

core = DbCore()
core.logger = logger


class ReadMilestonesResponse(BaseModel):
    data: List[Milestone]
    count: int


def read(
    filters: Optional[MilestoneParams] = None,
) -> ReadMilestonesResponse:
    logger.info(f"Listing Comments with filters: {filters}")
    from ..query_builder import QueryBuilder

    builder = QueryBuilder(Milestone, filters)
    builder.build_full()
    query = builder.query
    params = tuple(builder.args)
    count_query = builder.count_query
    logger.debug("Milestone Read Query: %s \n Params: %s", query, params)
    comments = core.run_list(query, params, Milestone)
    count = core.run_scalar(count_query, params)
    logger.info(f"Total milestone found: {count}")
    return ReadMilestonesResponse(data=comments, count=count)
