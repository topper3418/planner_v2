# base class for db tables
from typing import List, Optional
from pydantic import BaseModel


class TableModel(BaseModel):
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
