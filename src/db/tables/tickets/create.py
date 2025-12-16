import logging

from ...core import DbCore, ExceptionPackage


from .base import Ticket


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def create(ticket: Ticket) -> int:
    logger.info(f"Creating new ticket: {ticket}")
    query, params = ticket.get_insert_query()
    exception_package = ExceptionPackage(
        foreign_key_constraint_error=f"Invalid thing_id: {ticket.thing_id} or category_id: {ticket.category_id}"
    )
    last_row_id = core.run_create(query, params, exception_package)
    ticket.id = last_row_id
    return last_row_id
