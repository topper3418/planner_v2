import logging
from typing import Optional

from ...core import DbCore


from .base import User


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def get_ticket_count(
    thing: "User", open_only: Optional[bool] = True
) -> None:
    if thing.id is None:
        thing.ticket_count = 0
        return
    query = "SELECT COUNT(*) FROM tickets WHERE user_id = ?"
    params = [thing.id]
    if open_only:
        query += " AND open = true"
    result = core.run_scalar(query, tuple(params))
    thing.ticket_count = result if result is not None else 0
