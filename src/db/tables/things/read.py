import logging
from typing import Optional, List

from ...core import DbCore

from .base import Thing
from .params import ThingParams


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def read(
    query_params: Optional[ThingParams] = None,
) -> List[Thing]:
    logger.info(f"Listing Things with params: {query_params}")
    select = (
        "SELECT t.id, t.category_id, t.name, t.description, t.docs_link"
    )
    from_clause = "FROM things t"
    where_seed = "WHERE 1=1"
    params = []
    if query_params and query_params.include:
        join_clauses = []
        if "category" in query_params.include:
            select += ", c.name AS category_name, c.description AS category_description"
            join_clauses.append(
                "LEFT JOIN thing_categories c ON t.category_id = c.id"
            )
        if "parent" in query_params.include:
            select += ", p.name AS parent_name, p.description AS parent_description, p.docs_link AS parent_docs_link"
            join_clauses.append("LEFT JOIN things p ON t.parent_id = p.id")
        query = (
            f"{select} {from_clause} {' '.join(join_clauses)} {where_seed}"
        )
    else:
        query = f"{select} {from_clause} {where_seed}"

    if query_params:
        if query_params.name is not None:
            query += " AND t.name LIKE ?"
            params.append(f"%{query_params.name}%")
        if query_params.category_id is not None:
            query += " AND t.category_id = ?"
            params.append(str(query_params.category_id))
        if query_params.parent_id == 0:
            query += " AND t.parent_id IS NULL"
        elif query_params.parent_id is not None:
            query += " AND t.parent_id = ?"
            params.append(str(query_params.parent_id))
        if query_params.search is not None:
            query += " AND (t.name LIKE ? OR t.description LIKE ?)"
            search_param = f"%{query_params.search}%"
            params.extend([search_param, search_param])
        if query_params.page_number and query_params.page_size:
            offset = (
                query_params.page_number - 1
            ) * query_params.page_size
            query += " LIMIT ? OFFSET ?"
            params.extend([str(query_params.page_size), str(offset)])
    things = core.run_list(query, tuple(params), Thing.from_row)
    if query_params and "children" in query_params.include:
        for thing in things:
            thing.populate_children()
    return things
