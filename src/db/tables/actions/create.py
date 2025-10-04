import logging

from ...core import DbCore, ExceptionPackage

from .base import Action


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def create(action: Action) -> int:
    logger.info(f"Creating action {action}")
    query = "INSERT INTO actions (action_text, ticket_id, action_type_id) VALUES (?, ?, ?)"
    params = (
        action.action_text,
        action.ticket_id,
        action.action_type_id,
    )
    exception_package = ExceptionPackage(
        foreign_key_constraint_error=f"Invalid ticket_id: {action.ticket_id}"
    )
    last_row_id = core.run_create(query, params, exception_package)
    action.id = last_row_id
    return last_row_id
