# base class for db tables
from typing import Dict, List, Optional, Type
from pydantic import BaseModel, Field, ConfigDict


class ReadResponse(BaseModel):
    data: List["TableModel"]
    count: int


class TableModel(BaseModel):
    __table_name__: str = ""  # to be set in subclasses
    __params_class__: Optional[Type[BaseModel]] = (
        None  # to be set in subclasses
    )
    model_config = ConfigDict(extra="allow")

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
    ) -> ReadResponse:
        raise NotImplementedError("Read method not implemented")

    @staticmethod
    def get_count(_: Optional[BaseModel] = None) -> int:
        raise NotImplementedError("Get count method not implemented")

    @staticmethod
    def delete(_: int) -> None:
        raise NotImplementedError("Delete method not implemented")

    @staticmethod
    def from_row(_: dict) -> "TableModel":
        raise NotImplementedError("From row method not implemented")

    def populate_children(
        self,
        recursive: Optional[bool] = False,
        get_count: Optional[bool] = False,
    ) -> None:
        raise NotImplementedError(
            "Populate children method not implemented"
        )

    @classmethod
    def get_column_fields(
        cls, exclude_pk: bool = False
    ) -> Dict[str, Field]:
        return {
            field_name: field
            for field_name, field in cls.__fields__.items()
            if field.json_schema_extra is not None
            and field.json_schema_extra.get("column_field", False)
            and not (
                exclude_pk
                and field.json_schema_extra.get("primary_key_field", False)
            )
        }

    @classmethod
    def get_foreign_key_fields(cls) -> Dict[str, Field]:
        return {
            field_name: field
            for field_name, field in cls.__fields__.items()
            if field.json_schema_extra
            and field.json_schema_extra.get("foreign_key_field", False)
        }

    @classmethod
    def get_relationship_fields(cls) -> Dict[str, Field]:
        return {
            field_name: field
            for field_name, field in cls.__fields__.items()
            if field.json_schema_extra
            and field.json_schema_extra.get("relationship_field", False)
        }
