from datetime import datetime
import logging

from ...core import DbCore, ExceptionPackage

from .base import Action


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def create(action: Action) -> int:
    logger.info(f"Creating action {action}")
    from ..categories import ActionType

    # verify the action type
    if (type_id := action.action_type_id) is None:
        raise ValueError("action_type_id must be provided")
    action_type: ActionType | None = ActionType.get_by_id(type_id)  # type: ignore
    if action_type is None:
        raise ValueError(f"Invalid action_type_id: {type_id}")

    # insert the action
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

    # if the action is a "Completed" action, update the ticket's completed_at
    from ..tickets import Ticket

    if action_type.name == "Completed":
        logger.info("Action is 'Completed', updating ticket's state")
        if ticket_id := action.ticket_id is None:
            raise ValueError(
                "ticket_id must be provided for 'Completed' action"
            )
        ticket: Ticket | None = Ticket.get_by_id(action.ticket_id)  # type: ignore
        if ticket is None:
            raise ValueError(f"Ticket with ID {ticket_id} not found")
        ticket.open = False
        ticket.overdue = False
        ticket.completed_at = datetime.now()
        ticket.update()

    # if the action is a "Reopened" action, update the ticket's completed_at
    if action_type.name == "Reopened":
        logger.info("Action is 'Reopened', updating ticket's state")
        if ticket_id := action.ticket_id is None:
            raise ValueError(
                "ticket_id must be provided for 'Reopened' action"
            )
        ticket: Ticket | None = Ticket.get_by_id(action.ticket_id)  # type: ignore
        if ticket is None:
            raise ValueError(f"Ticket with ID {ticket_id} not found")
        ticket.open = True
        ticket.completed_at = None
        ticket.update()

    return last_row_id
