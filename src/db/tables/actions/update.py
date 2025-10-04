import logging

from ...core import DbCore, ExceptionPackage

from .base import Action


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def update(action: Action) -> None:
    logger.info(f"Updating action: {action}")
    if action.id is None:
        raise ValueError("Action ID is required for update")
    query = (
        "UPDATE actions SET ticket_id = ?, action_type_id = ? WHERE id = ?"
    )
    params = (action.ticket_id, action.action_type_id, action.id)
    exception_package = ExceptionPackage(
        foreign_key_constraint_error=f"Invalid ticket_id: {action.ticket_id}",
        not_found_error=f"Action with ID {action.id} not found",
    )
    core.run_update(query, params, exception_package)
