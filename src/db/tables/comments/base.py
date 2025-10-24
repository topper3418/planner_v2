from typing import TYPE_CHECKING, Optional
from datetime import datetime

from ..table_model import TableModel
from ..fields import (
    ColumnField,
    ForeignKeyField,
    RelationshipField,
    PrimaryKeyField,
)

if TYPE_CHECKING:
    from ..tickets import Ticket


class Comment(TableModel):
    id: Optional[int] = PrimaryKeyField(None)
    ticket_id: Optional[int] = ForeignKeyField(None, on="id")
    content: Optional[str] = ColumnField(None)
    created_at: Optional[datetime] = ColumnField(None)

    ticket: Optional["Ticket"] = RelationshipField(table_model="Ticket")

    class Config:
        from_attributes = True
