from functools import wraps
from typing import TYPE_CHECKING, Any, Type, Union
from pydantic import Field, BaseModel
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


def ColumnField(default: Any, *args, **kwargs):
    """
    Returns A Pydantic Field subclass that indicates the field is intended for ORM use.
    """

    return Field(default=default, *args, **kwargs, column_field=True)


def ForeignKeyField(
    default: Any,
    on: str,
    *args,
    **kwargs,
):
    """
    Returns A Pydantic Field subclass that indicates the field is intended as a foreign key.
    """

    return ColumnField(
        default=default,
        *args,
        **kwargs,
        foreign_key_field=True,
        on=on,
    )


def RelationshipField(
    table_model: Union[str, Type[Any]],
    as_list: bool = False,
    *args,
    **kwargs,
):
    """
    Returns A Pydantic Field subclass that indicates the field is a relationship to another TableModel.
    """
    return Field(
        default=None,
        *args,
        **kwargs,
        relationship_field=True,
        table_model=table_model,
        as_list=as_list,
    )


def FilterParam(where_clause: str, repeat_arg: int = 1, *args, **kwargs):
    """
    Returns A Pydantic Field subclass that indicates the field is intended for filtering queries.
    """

    return Field(
        *args,
        **kwargs,
        filter_param=True,
        where_clause=where_clause,
        repeat_arg=repeat_arg,
    )
