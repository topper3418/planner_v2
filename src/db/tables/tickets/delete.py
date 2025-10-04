import logging

from ...core import DbCore, ExceptionPackage


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def delete(ticket_id: int) -> None:
    query = "DELETE FROM tickets WHERE id = ?"
    exception_package = ExceptionPackage(
        not_found_error=f"Ticket with ID {ticket_id} not found"
    )
    return core.run_delete(query, ticket_id, exception_package)
