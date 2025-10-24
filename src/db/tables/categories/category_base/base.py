import logging
from typing import Optional

from ...table_model import TableModel
from ...fields import ColumnField, PrimaryKeyField


class Category(TableModel):
    # config
    __category_model__ = "Category"
    __logger__ = logging.getLogger(__name__)
    # fields
    id: Optional[int] = PrimaryKeyField(None)
    name: Optional[str] = ColumnField(None)
    description: Optional[str] = ColumnField(None)

    class Config:
        from_attributes = True
