import logging

from ...core import DbCore, ExceptionPackage

from .base import Comment

logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def create(comment: Comment) -> int:
    logger.info(f"Creating new Comment: {comment}")
    query = "INSERT INTO comments (ticket_id, content) VALUES (?, ?)"
    params = (comment.ticket_id, comment.content)
    exception_package = ExceptionPackage(
        foreign_key_constraint_error=f"Invalid ticket_id: {comment.ticket_id}"
    )
    last_row_id = core.run_create(query, params, exception_package)
    comment.id = last_row_id
    return last_row_id
