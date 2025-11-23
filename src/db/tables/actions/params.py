from datetime import date, datetime
from typing import Literal, Optional

from pydantic import Field

from ..fields import FilterParam
from ..query_params import QueryParams


class ActionParams(QueryParams):
    action_type_id: Optional[int] = FilterParam(
        default=None, where_clause="actions.action_type_id = ?"
    )
    action_type_name: Optional[str] = FilterParam(
        default=None,
        where_clause="actions.action_type_id in (select id from action_types where name = ?)",
    )
    ticket_id: Optional[int] = FilterParam(
        default=None, where_clause="actions.ticket_id = ?"
    )
    performed_after: Optional[datetime] = FilterParam(
        default=None, where_clause="actions.performed_at >= ?"
    )
    performed_before: Optional[datetime] = FilterParam(
        default=None, where_clause="actions.performed_at <= ?"
    )
    include: list[Literal["ticket", "action_type"]] = []
    page_number: Optional[int] = Field(1, ge=1)
    page_size: Optional[int] = Field(10, ge=1, le=100)
