import logging

from ...core import DbCore, ExceptionPackage

from .base import Milestone


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def update(milestone: Milestone) -> None:
    logger.info(f"Updating Milestone: {milestone}")
    if milestone.id is None:
        raise ValueError("Milestone ID is required for update")
    query = (
        "UPDATE milestones SET "
        "name = ?, "
        "description = ?, "
        "due_date = ?, "
        "start_date = ? "
        "WHERE id = ?"
    )
    params = (
        milestone.name,
        milestone.description,
        milestone.due_date,
        milestone.start_date,
        milestone.id,
    )
    exception_package = ExceptionPackage(
        not_found_error=f"Milestone with ID {milestone.id} not found"
    )
    core.run_update(query, params, exception_package)
