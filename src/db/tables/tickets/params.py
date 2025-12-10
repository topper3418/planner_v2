from pydantic import Field
from typing import Literal, Optional
from datetime import date, datetime
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
    due_date_before: Optional[datetime] = FilterParam(
        default=None, where_clause="tickets.due_date <= ?"
    )
    due_date_after: Optional[datetime] = FilterParam(
        default=None, where_clause="tickets.due_date >= ?"
    )
    due_date: Optional[date] = FilterParam(
        default=None, where_clause="tickets.due_date = ?"
    )
    milestone_id: Optional[int] = FilterParam(
        default=None,
        where_clause="tickets.id in (SELECT ticket_id FROM ticket_milestones WHERE milestone_id = ?)",
    )
    milestone_ids: Optional[list[int]] = FilterParam(
        default=None,
        where_clause="tickets.id in (SELECT ticket_id FROM ticket_milestones WHERE milestone_id IN ({}))",
    )
    schedule_id: Optional[int] = FilterParam(
        default=None,
        where_clause="tickets.schedule_id = ?",
    )
    scheduled: Optional[bool] = FilterParam(
        default=None,
        where_clause="(tickets.schedule_id IS NOT NULL and ? = TRUE)",
        special_case=(False, "tickets.schedule_id IS NULL"),
    )
    user_id: Optional[int] = FilterParam(
        default=None,
        where_clause="tickets.user_id = ?",
        special_case=(0, "tickets.user_id IS NULL"),
    )
    user_ids: Optional[list[int]] = FilterParam(
        default=None,
        where_clause="tickets.user_id IN ({})",
        special_case=(0, "tickets.user_id IS NULL"),
    )
    exclude_ids: Optional[list[int]] = FilterParam(
        default=None, where_clause="tickets.id NOT IN ({})"
    )
    include: list[
        Literal[
            "thing",
            "category",
            "parent",
            "children",
            "user",
            "schedule",
            "milestones",
        ]
    ] = []
    page_number: Optional[int] = Field(default=1, ge=1)
    page_size: Optional[int] = Field(default=10, ge=1)
