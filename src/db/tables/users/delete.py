import logging

from ...core import DbCore, ExceptionPackage

logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def delete(user_id: int) -> None:
    logger.info(f"Deleting User with ID: {user_id}")
    query = "DELETE FROM users WHERE id = ?"
    exception_package = ExceptionPackage(
        not_found_error=f"User with ID {user_id} not found"
    )
    core.run_delete(query, user_id, exception_package)
