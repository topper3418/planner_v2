from pydantic import Field
from typing import Optional

from ..fields import FilterParam
from ..query_params import QueryParams


class ScheduleParams(QueryParams):
    name: Optional[str] = FilterParam(
        default=None, where_clause="schedules.name = ?"
    )
    search: Optional[str] = FilterParam(
        default=None,
        where_clause='schedules.name LIKE "%?%")',
        repeat_arg=2,
    )
    page_number: Optional[int] = Field(1, ge=1)
    page_size: Optional[int] = Field(10, ge=1, le=100)
