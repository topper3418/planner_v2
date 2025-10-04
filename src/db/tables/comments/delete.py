import logging

from ...core import DbCore, ExceptionPackage

logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def delete(comment_id: int) -> None:
    logger.info(f"Deleting Comment with ID: {comment_id}")
    query = "DELETE FROM comments WHERE id = ?"
    exception_package = ExceptionPackage(
        not_found_error=f"Comment with ID {comment_id} not found"
    )
    core.run_delete(query, comment_id, exception_package)
