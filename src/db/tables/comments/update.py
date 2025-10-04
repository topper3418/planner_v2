import logging

from ...core import DbCore, ExceptionPackage

from .base import Comment


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def update(comment: Comment) -> None:
    logger.info(f"Updating Comment: {comment}")
    if comment.id is None:
        raise ValueError("Comment ID is required for update")
    query = "UPDATE comments SET content = ? WHERE id = ?"
    params = (comment.content, comment.id)
    exception_package = ExceptionPackage(
        not_found_error=f"Comment with ID {comment.id} not found"
    )
    core.run_update(query, params, exception_package)
