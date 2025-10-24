from datetime import datetime
from typing import TYPE_CHECKING, Optional

from ..table_model import TableModel
from ..fields import (
    ColumnField,
    ForeignKeyField,
    RelationshipField,
    PrimaryKeyField,
)

if TYPE_CHECKING:
    from ..tickets import Ticket
    from ..categories import ActionType


class Action(TableModel):
    id: Optional[int] = PrimaryKeyField(None)
    ticket_id: Optional[int] = ForeignKeyField(None, on="id")
    action_text: Optional[str] = ColumnField(None)
    action_type_id: Optional[int] = ForeignKeyField(None, on="id")
    performed_at: Optional[datetime] = ColumnField(None)
    ticket: Optional["Ticket"] = RelationshipField(table_model="Ticket")
    action_type: Optional["ActionType"] = RelationshipField(
        table_model="ActionType"
    )

    class Config:
        from_attributes = True
