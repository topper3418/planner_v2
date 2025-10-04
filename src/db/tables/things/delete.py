import logging

from ...core import DbCore, ExceptionPackage


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def delete(thing_id: int) -> None:
    logger.info(f"Deleting Thing with ID: {thing_id}")
    query = "DELETE FROM things WHERE id = ?"
    exception_package = ExceptionPackage(
        not_found_error=f"Thing with ID {thing_id} not found",
        foreign_key_constraint_error=f"Cannot delete thing ID {thing_id}: it is referenced by other records",
    )
    core.run_delete(query, thing_id, exception_package)
