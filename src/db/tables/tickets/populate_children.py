import logging

from ...core import DbCore

from .base import Ticket


logger = logging.getLogger(__name__)


DbCore.logger = logger


def populate_children(ticket: Ticket) -> None:
    if ticket.id is None:
        ticket.children = []
        return
    query = "SELECT id, thing_id, category_id, description, created_at, open, updated_at, completed_at FROM tickets WHERE parent_id = ?"
    ticket.children = DbCore.run_list(query, (ticket.id,), Ticket)
