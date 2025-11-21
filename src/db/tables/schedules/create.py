import logging

from ...core import DbCore, ExceptionPackage

from .base import Schedule

logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def create(schedule: Schedule) -> int:
    logger.info(f"Creating new schedule: {schedule}")
    query = "INSERT INTO schedules (name, weekdays, monthdays, yeardays) VALUES (?, ?, ?, ?);"
    params = (
        schedule.name,
        schedule.weekdays,
        schedule.monthdays,
        schedule.yeardays,
    )
    logger.info(f"Schedule Create Query: {query} \n Params: {params}")
    exception_package = ExceptionPackage()
    last_row_id = core.run_create(query, params, exception_package)
    schedule.id = last_row_id
    return last_row_id
