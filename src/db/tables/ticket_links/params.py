from datetime import date, datetime
from typing import Literal, Optional

from pydantic import Field

from ...core import (
    QueryParams,
    FilterParam,
)


class TicketLinkParams(QueryParams):
    link_type_id: Optional[int] = FilterParam(
        default=None,
        where_clause="ticket_link_types.ticket_link_type_id = ?",
    )
    link_type_name: Optional[str] = FilterParam(
        default=None,
        where_clause="ticket_link_types.ticket_link_type_id in (select id from ticket_link_types where name = ?)",
    )
    ticket_id: Optional[int] = FilterParam(
        default=None, where_clause="actions.ticket_id = ?"
    )
    include: list[Literal["ticket", "ticket_link_type"]] = []
    page_number: Optional[int] = Field(1, ge=1)
    page_size: Optional[int] = Field(10, ge=1)
