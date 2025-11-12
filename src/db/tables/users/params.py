from pydantic import BaseModel, Field
from typing import Optional

from ..fields import FilterParam
from ..query_params import QueryParams


class UserParams(QueryParams):
    username: Optional[str] = FilterParam(
        default=None, where_clause="users.username = ?"
    )
    page_number: Optional[int] = Field(1, ge=1)
    page_size: Optional[int] = Field(10, ge=1)
