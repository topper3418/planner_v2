from typing import Literal, Optional

from pydantic import BaseModel, Field

from ..fields import FilterParam
from ..query_params import QueryParams


class ThingParams(QueryParams):
    name: Optional[str] = FilterParam(
        default=None,
        where_clause='things.name LIKE "%?%"',
    )
    category_id: Optional[int] = FilterParam(
        default=None, where_clause="things.category_id = ?"
    )
    parent_id: Optional[int] = FilterParam(
        default=None,
        where_clause="things.parent_id = ?",
        special_case=(0, "things.parent_id IS NULL"),
    )
    search: Optional[str] = FilterParam(
        default=None,
        where_clause="(things.name LIKE ? OR things.description LIKE ?)",
        repeat_arg=2,
        render_arg=lambda v: f"%{v}%",
    )
    include: list[Literal["category", "parent", "children"]] = []
    page_number: Optional[int] = Field(default=1, ge=1)
    page_size: Optional[int] = Field(default=10, ge=1, le=1000)
