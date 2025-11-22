from pydantic import BaseModel, Field
from typing import Literal, Optional

from ..fields import FilterParam
from ..query_params import QueryParams


class UserParams(QueryParams):
    username: Optional[str] = FilterParam(
        default=None, where_clause="users.username = ?"
    )
    include: list[Literal["tickets", "ticket_count"]] = []
    page_number: Optional[int] = Field(1, ge=1)
    page_size: Optional[int] = Field(10, ge=1)
