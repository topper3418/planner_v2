import logging
from typing import Optional

from ...core import DbCore


from .base import Thing


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def get_recursive_child_ids(
    thing_id: int, ids: Optional[set] = None
) -> set:
    if ids is None:
        ids = set()
    if thing_id is not None:
        ids.add(thing_id)
    child_id_query = "SELECT id FROM things WHERE parent_id = ?"

    def get_id(id: int):
        return id

    child_ids = core.run_list(child_id_query, (thing_id,), get_id)
    for child_id in child_ids:
        get_recursive_child_ids(child_id, ids)
    return ids


def get_recursive_ticket_count(
    thing: "Thing", open_only: Optional[bool] = True
) -> None:
    if thing.id is None:
        thing.recursive_ticket_count = 0
        return
    all_ids = get_recursive_child_ids(thing.id)
    query = f"SELECT COUNT(*) FROM tickets WHERE thing_id IN ({','.join(['?']*len(all_ids))})"
    params = list(all_ids)
    if open_only:
        query += " AND open = true"
    result = core.run_scalar(query, tuple(params))
    thing.recursive_ticket_count = result if result is not None else 0
