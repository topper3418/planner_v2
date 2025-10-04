import logging

from ...core import DbCore

from .base import Ticket


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def populate_children(ticket: Ticket) -> None:
    if ticket.id is None:
        ticket.children = []
        return
    query = "SELECT id, thing_id, category_id, description, created_at, open, updated_at, completed_at FROM tickets WHERE parent_id = ?"
    ticket.children = core.run_list(query, (ticket.id,), Ticket)
