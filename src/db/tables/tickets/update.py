import logging
from ...core import DbCore, ExceptionPackage


from .base import Ticket


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def update(ticket: Ticket) -> None:
    if ticket.id is None:
        raise ValueError("Ticket ID is required for update")
    query = (
        "UPDATE tickets SET"
        " title = ?,"
        " thing_id = ?,"
        " category_id = ?,"
        " description = ?,"
        " open = ?,"
        " updated_at = CURRENT_TIMESTAMP,"
        " completed_at = ?,"
        " user_id = ?,"
        " schedule_id = ?"
        " WHERE id = ?"
    )
    params = (
        ticket.title,
        ticket.thing_id,
        ticket.category_id,
        ticket.description,
        ticket.open,
        ticket.completed_at,
        ticket.user_id,
        ticket.schedule_id,
        ticket.id,
    )
    exception_package = ExceptionPackage(
        foreign_key_constraint_error=f"Invalid thing_id: {ticket.thing_id} or category_id: {ticket.category_id}",
        not_found_error=f"Ticket with ID {ticket.id} not found",
    )
    core.run_update(query, params, exception_package)
