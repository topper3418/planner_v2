import logging
from typing import Optional, List

from pydantic import BaseModel

from ...core import DbCore

from .base import Schedule
from .params import ScheduleParams


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


class ReadSchedulesResponse(BaseModel):
    data: List[Schedule]
    count: int


def read(
    filters: Optional[ScheduleParams] = None,
) -> ReadSchedulesResponse:
    logger.info(f"Listing Schedules with filters: {filters}")
    from ..query_builder import QueryBuilder

    builder = QueryBuilder(Schedule, filters)
    builder.build_full()
    query = builder.query
    params = tuple(builder.args)
    count_query = builder.count_query
    logger.debug("Schedule Read Query: %s \n Params: %s", query, params)
    schedules = core.run_list(query, params, Schedule)
    count = core.run_scalar(count_query, params)
    logger.info(f"Total schedule found: {count}")
    return ReadSchedulesResponse(data=schedules, count=count)
