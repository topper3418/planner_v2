from typing import TYPE_CHECKING, Optional, List
from datetime import datetime

from ..table_model import TableModel
from ..fields import (
    ColumnField,
    ForeignKeyField,
    RelationshipField,
    PrimaryKeyField,
)

if TYPE_CHECKING:
    from ..things import Thing
    from ..categories import TicketCategory
    from ..users import User


# Pydantic model for Ticket
class Ticket(TableModel):
    id: Optional[int] = PrimaryKeyField(None)
    title: Optional[str] = ColumnField(None)
    description: Optional[str] = ColumnField(None)
    open: Optional[bool] = ColumnField(True)

    created_at: Optional[datetime] = ColumnField(None)
    updated_at: Optional[datetime] = ColumnField(None)
    completed_at: Optional[datetime] = ColumnField(None)

    thing_id: Optional[int] = ForeignKeyField(None, on="id")
    category_id: Optional[int] = ForeignKeyField(None, on="id")
    parent_id: Optional[int] = ForeignKeyField(None, on="id")
    user_id: Optional[int] = ForeignKeyField(None, on="id")

    thing: Optional["Thing"] = RelationshipField(table_model="Thing")
    category: Optional["TicketCategory"] = RelationshipField(
        table_model="TicketCategory"
    )
    parent: Optional["Ticket"] = RelationshipField(table_model="Ticket")
    user: Optional["User"] = RelationshipField(table_model="User")
    children: Optional[List["Ticket"]] = None

    class Config:
        from_attributes = True
