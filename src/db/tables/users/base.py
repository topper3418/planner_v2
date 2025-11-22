from typing import TYPE_CHECKING, Optional

from ..table_model import TableModel
from ..fields import (
    ColumnField,
    PrimaryKeyField,
)


class User(TableModel):
    id: Optional[int] = PrimaryKeyField(None)
    username: Optional[str] = ColumnField(None)

    ticket_count: Optional[int] = None
    tickets: Optional[list["Ticket"]] = None  # populated dynamically

    class Config:
        from_attributes = True


if TYPE_CHECKING:
    from ..tickets import Ticket
