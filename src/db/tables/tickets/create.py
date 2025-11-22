import logging

from ...core import DbCore, ExceptionPackage


from .base import Ticket


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def create(ticket: Ticket) -> int:
    query = (
        "INSERT INTO tickets"
        " (title, thing_id, category_id, description, open, user_id, schedule_id)"
        " VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    params = (
        ticket.title,
        ticket.thing_id,
        ticket.category_id,
        ticket.description,
        ticket.open,
        ticket.schedule_id,
        ticket.user_id,
    )
    exception_package = ExceptionPackage(
        foreign_key_constraint_error=f"Invalid thing_id: {ticket.thing_id} or category_id: {ticket.category_id}"
    )
    last_row_id = core.run_create(query, params, exception_package)
    ticket.id = last_row_id
    return last_row_id
