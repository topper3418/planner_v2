import logging
from typing import Optional, List

from ...core import DbCore

from .base import Comment
from .params import CommentParams


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def read(
    filters: Optional[CommentParams] = None,
) -> List[Comment]:
    logger.info(f"Listing Comments with filters: {filters}")
    query = "SELECT id, ticket_id, content, created_at FROM comments WHERE content LIKE ?"
    params = [
        f"%{filters.content if filters and filters.content else ''}%"
    ]

    if filters:
        if filters.ticket_id is not None:
            query += " AND ticket_id = ?"
            params.append(str(filters.ticket_id))
        if (
            filters.page_number is not None
            and filters.page_size is not None
        ):
            offset = (filters.page_number - 1) * filters.page_size
            query += " LIMIT ? OFFSET ?"
            params.append(str(filters.page_size))
            params.append(str(offset))
    return core.run_list(query, tuple(params), Comment)
