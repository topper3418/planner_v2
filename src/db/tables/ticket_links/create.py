import logging

from ...core import DbCore, ExceptionPackage

from .base import TicketLink


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def create(ticket_link: TicketLink) -> int:
    logger.info(f"Creating ticket link {ticket_link}")
    from ..categories import TicketLinkType

    # verify the action type
    if (type_id := ticket_link.link_type_id) is None:
        raise ValueError("action_type_id must be provided")
    link_type: TicketLinkType | None = TicketLinkType.get_by_id(type_id)  # type: ignore
    if link_type is None:
        raise ValueError(f"Invalid action_type_id: {type_id}")

    # insert the link
    query, params = ticket_link.get_insert_query()
    exception_package = ExceptionPackage(
        foreign_key_constraint_error=f"Invalid ticket_id: {ticket_link.ticket_id}"
    )
    last_row_id = core.run_create(query, params, exception_package)
    ticket_link.id = last_row_id

    return last_row_id
