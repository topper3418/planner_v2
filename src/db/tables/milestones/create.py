import logging

from src.db.tables.milestones.base import Milestone

from ...core import DbCore, ExceptionPackage

from .base import Milestone

logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def create(milestone: Milestone) -> int:
    logger.info(f"Creating new milestone: {milestone}")
    query = "INSERT INTO milestones (name, description, due_date) VALUES (?, ?, ?);"
    params = (
        milestone.name,
        milestone.description,
        milestone.due_date,
    )
    logger.info(f"Milestone Create Query: {query} \n Params: {params}")
    exception_package = ExceptionPackage()
    last_row_id = core.run_create(query, params, exception_package)
    milestone.id = last_row_id
    return last_row_id
