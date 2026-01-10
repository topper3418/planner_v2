import logging

from ...core import DbCore, ExceptionPackage

from .base import TicketLink


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def delete(ticket_link_id: int) -> None:
    logger.info(f"Deleting ticket link with ID: {ticket_link_id}")
    query = TicketLink.get_delete_query()
    exception_package = ExceptionPackage(
        not_found_error=f"Ticket Link with ID {ticket_link_id} not found"
    )
    core.run_delete(query, ticket_link_id, exception_package)
