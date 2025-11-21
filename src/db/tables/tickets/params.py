from pydantic import Field
from typing import Literal, Optional
from datetime import datetime
from ..fields import FilterParam
from ..query_params import QueryParams


# TODO: merge thing id and thing ids, should be easy


class TicketParams(QueryParams):
    thing_ids: Optional[list[int]] = FilterParam(
        default=None, where_clause="tickets.thing_id IN ({})"
    )
    category_id: Optional[int] = FilterParam(
        default=None, where_clause="tickets.category_id = ?"
    )
    category_ids: Optional[list[int]] = FilterParam(
        default=None, where_clause="tickets.category_id IN ({})"
    )
    parent_id: Optional[int] = FilterParam(
        default=None, where_clause="tickets.parent_id = ?"
    )
    open: Optional[bool] = FilterParam(
        default=None, where_clause="tickets.open = ?"
    )
    search: Optional[str] = FilterParam(
        default=None,
        where_clause="(tickets.description LIKE ? OR tickets.title LIKE ?)",
        repeat_arg=2,
        template="%{}%",
    )
    created_after: Optional[datetime] = FilterParam(
        default=None, where_clause="tickets.created_at >= ?"
    )
    created_before: Optional[datetime] = FilterParam(
        default=None, where_clause="tickets.created_at <= ?"
    )
    updated_after: Optional[datetime] = FilterParam(
        default=None, where_clause="tickets.updated_at >= ?"
    )
    updated_before: Optional[datetime] = FilterParam(
        default=None, where_clause="tickets.updated_at <= ?"
    )
    completed_after: Optional[datetime] = FilterParam(
        default=None, where_clause="tickets.completed_at >= ?"
    )
    completed_before: Optional[datetime] = FilterParam(
        default=None, where_clause="tickets.completed_at <= ?"
    )
    milestone_id: Optional[int] = FilterParam(
        default=None,
        where_clause="tickets.id in (SELECT ticket_id FROM ticket_milestones WHERE milestone_id = ?)",
    )
    schedule_id: Optional[int] = FilterParam(
        default=None,
        where_clause="tickets.schedule_id = ?",
    )
    user_id: Optional[int] = FilterParam(
        default=None,
        where_clause="tickets.user_id = ?",
    )
    exclude_ids: Optional[list[int]] = FilterParam(
        default=None, where_clause="tickets.id NOT IN ({})"
    )
    include: list[
        Literal[
            "thing", "category", "parent", "children", "user", "schedule"
        ]
    ] = []
    page_number: Optional[int] = Field(default=1, ge=1)
    page_size: Optional[int] = Field(default=10, ge=1)
