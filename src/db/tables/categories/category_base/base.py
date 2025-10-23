import logging
from typing import Optional

from pydantic import BaseModel

from ...table_model import TableModel
from ...util import ColumnField


class Category(TableModel):
    # config
    __category_model__ = "Category"
    __logger__ = logging.getLogger(__name__)
    # fields
    id: Optional[int] = ColumnField(None)
    name: Optional[str] = ColumnField(None)
    description: Optional[str] = ColumnField(None)

    class Config:
        from_attributes = True
