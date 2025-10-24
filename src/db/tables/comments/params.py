from pydantic import BaseModel, Field
from typing import Optional

from ..fields import FilterParam
from ..query_params import QueryParams


class CommentParams(QueryParams):
    content: Optional[str] = FilterParam(
        default=None,
        where_clause='comments.content LIKE "%?%"',
    )
    ticket_id: Optional[int] = FilterParam(
        default=None, where_clause="comments.ticket_id = ?"
    )
    page_number: Optional[int] = Field(1, ge=1)
    page_size: Optional[int] = Field(10, ge=1, le=100)
