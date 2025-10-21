from functools import wraps
from typing import TYPE_CHECKING, Any, Type, Union
from pydantic import Field
from pydantic.utils import import_string

if TYPE_CHECKING:
    from .table_model import TableModel


def as_staticmethod(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)

    return staticmethod(wrapper)


def as_classmethod(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)

    return classmethod(wrapper)


class ColumnField(Field):
    """
    A Pydantic Field subclass that indicates the field is intended for ORM use.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.extra["column_field"] = True


class ForeignKeyField(ColumnField):
    """
    A Pydantic Field subclass that indicates the field is intended as a foreign key.
    """

    def __init__(self, on: str, mandatory: bool = False, *args, **kwargs):
        """
        joins: The table to join with.
        on: The field in the joined table to match.
        """
        super().__init__(
            int | None if not mandatory else int, *args, **kwargs
        )
        self.on = on
        self.extra["foreign_key_field"] = True


class RelationshipField(Field):
    def __init__(
        self,
        table_model: Union[str, Type[Any]],
        as_list: bool = False,
        *args,
        **kwargs
    ):
        """
        A Pydantic Field subclass that indicates the field is a relationship to another TableModel.
        """
        super().__init__(
            (
                Union[table_model | None]
                if not as_list
                else list[table_model] | None
            ),
            *args,
            **kwargs
        )
        self.extra["relationship_field"] = True
        self._table_model = table_model

    @property
    def table_model(self) -> Type[Any]:
        """Resolve table_model to the actual class."""
        if isinstance(self.table_model, str):
            return import_string(self.table_model)
        return self.table_model


class FilterParam(Field):
    """
    A Pydantic Field subclass that indicates the field is intended for filtering queries.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.extra["filter_param"] = True
