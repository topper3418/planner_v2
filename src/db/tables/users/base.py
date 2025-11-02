from typing import TYPE_CHECKING, Optional
from datetime import datetime

from ..table_model import TableModel
from ..fields import (
    ColumnField,
    PrimaryKeyField,
)


class User(TableModel):
    id: Optional[int] = PrimaryKeyField(None)
    username: Optional[str] = ColumnField(None)

    class Config:
        from_attributes = True
