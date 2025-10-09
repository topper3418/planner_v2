from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import datetime


# TODO: merge thing id and thing ids, should be easy


class TicketParams(BaseModel):
    thing_id: Optional[int] = None
    thing_ids: Optional[list[int]] = None
    category_id: Optional[int] = None
    parent_id: Optional[int] = None
    open: Optional[bool] = None
    search: Optional[str] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None
    updated_after: Optional[datetime] = None
    updated_before: Optional[datetime] = None
    completed_after: Optional[datetime] = None
    completed_before: Optional[datetime] = None
    include: list[Literal["thing", "category", "parent", "children"]] = []
    page_number: Optional[int] = Field(1, ge=1)
    page_size: Optional[int] = Field(10, ge=1, le=100)
    exclude_ids: Optional[list[int]] = None
