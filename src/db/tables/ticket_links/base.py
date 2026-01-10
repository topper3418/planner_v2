from datetime import datetime
from typing import TYPE_CHECKING, Optional

from ...core import (
    TableModel,
    ColumnField,
    ForeignKeyField,
    RelationshipField,
    PrimaryKeyField,
)

if TYPE_CHECKING:
    from ..tickets import Ticket
    from ..categories import TicketLinkType


class TicketLink(TableModel):
    id: Optional[int] = PrimaryKeyField(None)
    ticket_id: Optional[int] = ForeignKeyField(None, on="id")
    link_type_id: Optional[int] = ForeignKeyField(None, on="id")
    label: Optional[str] = ColumnField(None)
    link: Optional[str] = ColumnField(None)
    ticket: Optional["Ticket"] = RelationshipField(table_model="Ticket")
    link_type: Optional["TicketLinkType"] = RelationshipField(
        table_model="TicketLinkType"
    )

    class Config:
        from_attributes = True
