import logging

from ...core import DbCore, ExceptionPackage

logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def delete(schedule_id: int) -> None:
    logger.info(f"Deleting Schedule with ID: {schedule_id}")
    query = "DELETE FROM milestones WHERE id = ?"
    exception_package = ExceptionPackage(
        not_found_error=f"Milestone with ID {schedule_id} not found"
    )
    core.run_delete(query, schedule_id, exception_package)
