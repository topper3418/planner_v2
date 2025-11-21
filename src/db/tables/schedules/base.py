from typing import TYPE_CHECKING, Optional

from ..table_model import TableModel
from ..fields import (
    ColumnField,
    PrimaryKeyField,
)


class Schedule(TableModel):
    id: Optional[int] = PrimaryKeyField(None)
    name: Optional[str] = ColumnField(None)
    weekdays: Optional[str] = ColumnField(None)
    monthdays: Optional[str] = ColumnField(None)
    yeardays: Optional[str] = ColumnField(None)

    tickets: Optional[list["Ticket"]] = None  # to be populated externally

    class Config:
        from_attributes = True

    @property
    def weekdays_list(self) -> list[int]:
        if self.weekdays:
            return [int(day) for day in self.weekdays.split(",")]
        return []

    @property
    def monthdays_list(self) -> list[int]:
        if self.monthdays:
            return [int(day) for day in self.monthdays.split(",")]
        return []

    @property
    def yeardays_list(self) -> list[int]:
        if self.yeardays:
            return [int(day) for day in self.yeardays.split(",")]
        return []


if TYPE_CHECKING:
    from ..tickets import Ticket
