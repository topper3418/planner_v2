import logging

from ...core import DbCore

from .base import Ticket


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def populate_category(ticket: Ticket) -> None:
    from ..categories import TicketCategory

    ticket.category = TicketCategory.get_by_id(ticket.category_id)  # type: ignore
