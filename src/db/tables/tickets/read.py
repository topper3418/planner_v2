import logging
from typing import Optional, List

from ...core import DbCore


from .base import Ticket
from .params import TicketParams


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def read(
    query_params: Optional[TicketParams] = None,
) -> List[Ticket]:
    select = "SELECT t.id, t.title, t.thing_id, t.category_id, t.parent_id, t.description, t.created_at, t.open, t.updated_at, t.completed_at"
    from_clause = "FROM tickets t"
    where_seed = "WHERE 1=1"
    params = []
    if query_params and query_params.include:
        join_clauses = []
        if "thing" in query_params.include:
            select += ", th.name AS thing_name, th.description AS thing_description, th.docs_link AS thing_docs_link, th.parent_id AS thing_parent_id, th.category_id AS thing_category_id"
            join_clauses.append(
                "LEFT JOIN things th ON t.thing_id = th.id"
            )
        if "category" in query_params.include:
            select += ", c.name AS category_name, c.description AS category_description"
            join_clauses.append(
                "LEFT JOIN ticket_categories c ON t.category_id = c.id"
            )
        if "parent" in query_params.include:
            select += ", p.id AS parent_id, p.description AS parent_description, p.open AS parent_open, p.created_at AS parent_created_at, p.updated_at AS parent_updated_at, p.completed_at AS parent_completed_at"
            join_clauses.append(
                "LEFT JOIN tickets p ON t.parent_id = p.id"
            )
        query = (
            f"{select} {from_clause} {' '.join(join_clauses)} {where_seed}"
        )
    else:
        query = f"{select} {from_clause} {where_seed}"

    if query_params:
        if (
            query_params.thing_ids is not None
            and query_params.thing_ids != 0
        ):
            placeholders = ",".join("?" * len(query_params.thing_ids))
            query += f" AND t.thing_id IN ({placeholders})"
            params.extend(str(tid) for tid in query_params.thing_ids)
        if query_params.category_id is not None:
            query += " AND t.category_id = ?"
            params.append(str(query_params.category_id))
        if query_params.parent_id == 0:
            query += " AND t.parent_id IS NULL"
        elif query_params.parent_id is not None:
            query += " AND t.parent_id = ?"
            params.append(str(query_params.parent_id))
        if query_params.open is not None:
            query += " AND t.open = ?"
            params.append(int(query_params.open))
        if query_params.search is not None:
            query += " AND (t.description LIKE ? OR t.title LIKE ?)"
            search_param = f"%{query_params.search}%"
            params.extend([search_param, search_param])
        if query_params.created_after is not None:
            query += " AND t.created_at >= ?"
            params.append(query_params.created_after.isoformat())
        if query_params.created_before is not None:
            query += " AND t.created_at <= ?"
            params.append(query_params.created_before.isoformat())
        if query_params.updated_after is not None:
            query += " AND t.updated_at >= ?"
            params.append(query_params.updated_after.isoformat())
        if query_params.updated_before is not None:
            query += " AND t.updated_at <= ?"
            params.append(query_params.updated_before.isoformat())
        if query_params.completed_after is not None:
            query += " AND t.completed_at >= ?"
            params.append(query_params.completed_after.isoformat())
        if query_params.completed_before is not None:
            query += " AND t.completed_at <= ?"
            params.append(query_params.completed_before.isoformat())
        if query_params.exclude_ids is not None:
            placeholders = ",".join("?" * len(query_params.exclude_ids))
            query += f" AND t.id NOT IN ({placeholders})"
            params.extend(str(eid) for eid in query_params.exclude_ids)
        if query_params.page_number and query_params.page_size:
            offset = (
                query_params.page_number - 1
            ) * query_params.page_size
            query += " LIMIT ? OFFSET ?"
            params.extend([str(query_params.page_size), str(offset)])
    tickets = core.run_list(query, tuple(params), Ticket.from_row)
    if query_params and "children" in query_params.include:
        for ticket in tickets:
            ticket.populate_children()
    return tickets
