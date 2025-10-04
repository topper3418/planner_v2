from typing import Optional
from datetime import datetime

from ..table_model import TableModel


class Comment(TableModel):
    id: Optional[int] = None
    ticket_id: Optional[int] = None
    content: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
