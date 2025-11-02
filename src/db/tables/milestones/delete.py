import logging

from ...core import DbCore, ExceptionPackage

logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def delete(milestone_id: int) -> None:
    logger.info(f"Deleting Milestone with ID: {milestone_id}")
    query = "DELETE FROM milestones WHERE id = ?"
    exception_package = ExceptionPackage(
        not_found_error=f"Milestone with ID {milestone_id} not found"
    )
    core.run_delete(query, milestone_id, exception_package)
