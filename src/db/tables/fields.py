from typing import Any, Callable, Type, Union

from pydantic import Field


def ColumnField(default: Any, *args, **kwargs):
    """
    Returns A Pydantic Field subclass that indicates the field is intended for ORM use.
    """

    return Field(default=default, *args, **kwargs, column_field=True)  # type: ignore


def PrimaryKeyField(default: Any, *args, **kwargs):
    """
    Returns A Pydantic Field subclass that indicates the field is intended as a primary key.
    """

    return ColumnField(
        default=default,
        *args,
        **kwargs,
        primary_key_field=True,
    )


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
    return Field(  # type: ignore
        default=None,
        *args,
        **kwargs,
        relationship_field=True,
        table_model=table_model,
        as_list=as_list,
    )


def FilterParam(
    where_clause: str,
    repeat_arg: int = 1,
    render_arg: Callable[[Any], Any] = lambda v: v,
    special_case: tuple | None = None,
    *args,
    **kwargs,
):
    """
    Returns A Pydantic Field subclass that indicates the field is intended for filtering queries.
    """

    return Field(  # type: ignore
        *args,
        **kwargs,
        json_schema_extra={
            "filter_param": True,
            "where_clause": where_clause,
            "repeat_arg": repeat_arg,
            "special_case": special_case,
        },
        render_arg=render_arg,
    )
