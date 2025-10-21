from typing import TYPE_CHECKING, Optional, List
from datetime import datetime

from ..table_model import TableModel
from ..util import ColumnField, ForeignKeyField, RelationshipField

if TYPE_CHECKING:
    from ..things import Thing
    from ..categories import TicketCategory


# Pydantic model for Ticket
class Ticket(TableModel):
    id: Optional[int] = ColumnField(None)
    title: Optional[str] = ColumnField(None)
    description: Optional[str] = ColumnField(None)
    open: Optional[bool] = ColumnField(True)

    created_at: Optional[datetime] = ColumnField(None)
    updated_at: Optional[datetime] = ColumnField(None)
    completed_at: Optional[datetime] = ColumnField(None)

    thing_id: Optional[int] = ForeignKeyField(on="id")
    category_id: Optional[int] = ForeignKeyField(on="id")
    parent_id: Optional[int] = ForeignKeyField(on="id")

    thing: Optional["Thing"] = RelationshipField(table_model="Thing")
    category: Optional["TicketCategory"] = RelationshipField(
        table_model="TicketCategory"
    )
    parent: Optional["Ticket"] = RelationshipField(table_model="Ticket")
    children: Optional[List["Ticket"]] = None

    class Config:
        from_attributes = True
