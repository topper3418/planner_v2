import logging
from typing import Optional

from ...core import DbCore


from .base import Ticket


logger = logging.getLogger(__name__)


DbCore.logger = logger


def get_by_id(ticket_id: int) -> Optional[Ticket]:
    query = (
        "SELECT"
        " t.id, t.thing_id, t.category_id, t.description, t.created_at, t.open, t.updated_at, t.completed_at,"
        " c.name AS category_name, c.description AS category_description,"
        " th.name AS thing_name, th.description AS thing_description, th.docs_link AS thing_docs_link, th.parent_id AS thing_parent_id, th.category_id AS thing_category_id,"
        " p.id AS parent_id, p.description AS parent_description, p.open AS parent_open, p.created_at AS parent_created_at, p.updated_at AS parent_updated_at, p.completed_at AS parent_completed_at"
        " FROM tickets t"
        " JOIN ticket_categories c ON t.category_id = c.id"
        " JOIN things th ON t.thing_id = th.id"
        " JOIN tickets p ON t.parent_id = p.id"
        " WHERE id = ?"
    )
    ticket = DbCore.run_get_by_id(query, ticket_id, Ticket.from_row)
    if ticket:
        ticket.populate_children()
    return ticket
