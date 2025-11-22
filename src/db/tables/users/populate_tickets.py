import logging
from typing import TYPE_CHECKING, Optional

from ...core import DbCore


from .base import User


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def populate_tickets(
    user: "User",
    open_only: Optional[bool] = True,
) -> None:
    from ..tickets import Ticket

    if user.id is None:
        user.tickets = []
        return
    query = "SELECT id, title, description, status, created_at, updated_at, user_id, thing_id FROM tickets WHERE user_id = ?"
    if open_only:
        query += " AND open = true"
    user.tickets = core.run_list(query, (user.id,), Ticket)
