import logging

from ...core import DbCore, ExceptionPackage

from .base import TicketLink


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def update(ticket_link: TicketLink) -> None:
    logger.info(f"Updating action: {ticket_link}")
    if ticket_link.id is None:
        raise ValueError("Ticket Link ID is required for update")
    query, params = ticket_link.get_update_query()
    exception_package = ExceptionPackage(
        foreign_key_constraint_error=f"Invalid ticket_id: {ticket_link.ticket_id}",
        not_found_error=f"Action with ID {ticket_link.id} not found",
    )
    core.run_update(query, params, exception_package)
