import logging
from typing import Optional

from ...core import DbCore

from .base import Action
from .params import ActionParams


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def read_actions(
    query_params: Optional[ActionParams] = None,
) -> list[Action]:
    logger.info(f"Listing actions with filters: {query_params}")
    select_clause = (
        "SELECT"
        " a.id, a.action_text, a.ticket_id, a.action_type_id, a.performed_at"
    )
    from_clause = " FROM actions a"
    where_clause = " WHERE 1 = 1"
    params = []

    if query_params and query_params.include:
        joins = []
        if "ticket" in query_params.include:
            select_clause += (
                ", t.title AS ticket_title"
                ", t.description AS ticket_description"
                ", t.thing_id AS ticket_thing_id"
                ", t.category_id AS ticket_category_id"
                ", t.parent_id AS ticket_parent_id"
                ", t.created_at AS ticket_created_at"
                ", t.open AS ticket_open"
                ", t.updated_at AS ticket_updated_at"
                ", t.completed_at AS ticket_completed_at"
            )
            joins.append(" LEFT JOIN tickets t ON a.ticket_id = t.id")
        if "action_type" in query_params.include:
            select_clause += (
                ", at.name AS action_type_name"
                ", at.description AS action_type_description"
            )
            joins.append(
                " LEFT JOIN action_types at ON a.action_type_id = at.id"
            )
        query = select_clause + from_clause + "".join(joins) + where_clause
    else:
        query = select_clause + from_clause + where_clause

    if query_params:
        if query_params.action_type is not None:
            query += " AND a.action_type = ?"
            params.append(query_params.action_type)
        if query_params.ticket_id is not None:
            query += " AND a.ticket_id = ?"
            params.append(str(query_params.ticket_id))
        if (
            query_params.page_number is not None
            and query_params.page_size is not None
        ):
            offset = (
                query_params.page_number - 1
            ) * query_params.page_size
            query += " LIMIT ? OFFSET ?"
            params.append(str(query_params.page_size))
            params.append(str(offset))

    return core.run_list(query, tuple(params), Action.from_row)
