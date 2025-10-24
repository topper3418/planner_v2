import logging
from typing import TYPE_CHECKING, Optional, List

from ..table_model import TableModel
from ..fields import (
    ColumnField,
    ForeignKeyField,
    PrimaryKeyField,
    RelationshipField,
)


logger = logging.getLogger(__name__)


if TYPE_CHECKING:
    from ..categories import ThingCategory


# Pydantic model for Thing
class Thing(TableModel):
    id: Optional[int] = PrimaryKeyField(None)
    name: Optional[str] = ColumnField(None)
    description: Optional[str] = ColumnField(None)
    docs_link: Optional[str] = ColumnField(None)

    category_id: Optional[int] = ForeignKeyField(None, on="id")
    parent_id: Optional[int] = ForeignKeyField(None, on="id")

    category: Optional["ThingCategory"] = RelationshipField(
        table_model="ThingCategory"
    )
    parent: Optional["Thing"] = RelationshipField(table_model="Thing")
    children: Optional[List["Thing"]] = RelationshipField(
        table_model="Thing"
    )

    class Config:
        from_attributes = True
