from typing import TYPE_CHECKING, Optional, List
from datetime import datetime

from ..table_model import TableModel

if TYPE_CHECKING:
    from ..things import Thing
    from ..categories import TicketCategory


# Pydantic model for Ticket
class Ticket(TableModel):
    id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    open: Optional[bool] = True

    thing_id: Optional[int] = None
    category_id: Optional[int] = None
    parent_id: Optional[int] = None

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    thing: Optional["Thing"] = None
    category: Optional["TicketCategory"] = None
    parent: Optional["Ticket"] = None
    children: Optional[List["Ticket"]] = None

    class Config:
        from_attributes = True
