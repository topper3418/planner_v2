import logging
from typing import Optional

from ...core import DbCore

from .base import Action


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def get_by_id(action_id: int) -> Optional[Action]:
    logger.info(f"Getting action by ID: {action_id}")
    query = (
        "SELECT"
        " a.id, a.ticket_id, a.action_type_id, a.performed_at,"
        " t.title AS ticket_title, t.description AS ticket_description, t.thing_id AS ticket_thing_id, t.category_id AS ticket_category_id, t.parent_id AS ticket_parent_id, t.created_at AS ticket_created_at, t.open AS ticket_open, t.updated_at AS ticket_updated_at, t.completed_at AS ticket_completed_at"
        " at.name AS action_type_name, at.description AS action_type_description"
        " FROM actions a"
        " LEFT JOIN tickets t ON a.ticket_id = t.id"
        " LEFT JOIN action_types at ON a.action_type = at.id"
        " WHERE id = ?"
    )
    return core.run_get_by_id(query, action_id, Action.from_row)
