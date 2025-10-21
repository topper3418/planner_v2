# base class for db tables
from typing import TYPE_CHECKING, List, Optional
from pydantic import BaseModel
from src.db.tables.util import ColumnField, ForeignKeyField

if TYPE_CHECKING:
    from .util import RelationshipField


class TableModel(BaseModel):
    __table_name__: str = ""  # to be set in subclasses
    __params_class__: Optional[BaseModel] = None  # to be set in subclasses

    def create(self) -> int:
        raise NotImplementedError("Create method not implemented")

    def update(self) -> None:
        raise NotImplementedError("Update method not implemented")

    @staticmethod
    def get_by_id(_: int) -> Optional["TableModel"]:
        raise NotImplementedError("Get by ID method not implemented")

    @staticmethod
    def read(
        _: Optional[BaseModel] = None,
    ) -> List["TableModel"]:
        raise NotImplementedError("Read method not implemented")

    @staticmethod
    def delete(_: int) -> None:
        raise NotImplementedError("Delete method not implemented")

    @staticmethod
    def from_row(_: dict) -> "TableModel":
        raise NotImplementedError("From row method not implemented")

    def populate_children(self, recursive: Optional[bool] = False) -> None:
        raise NotImplementedError(
            "Populate children method not implemented"
        )

    @property
    def orm_fields(self) -> dict[str, ColumnField]:
        return {
            field_name: field
            for field_name, field in self.__fields__.items()
            if field.field_info.extra.get("column_field", False)
        }

    @property
    def foreign_key_fields(self) -> dict[str, ForeignKeyField]
        return {
            field_name: field
            for field_name, field in self.__fields__.items()
            if field.field_info.extra.get("foreign_key_field", False)
        }

    @property
    def relationship_fields(self) -> dict[str, RelationshipField]:
        return {
            field_name: field
            for field_name, field in self.__fields__.items()
            if field.field_info.extra.get("relationship_field", False)
        }
