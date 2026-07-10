from typing import Any, Callable, Type, Union

from pydantic import Field


def ColumnField(default: Any, nullable=True, *args, **kwargs):
    """
    Returns A Pydantic Field subclass that indicates the field is intended for ORM use.
    """

    return Field(default=default, *args, **kwargs, column_field=True, nullable=nullable)  # type: ignore


def DateTimeField(use_current_timestamp=False, *args, **kwargs):
    if use_current_timestamp:
        # Lazy import avoids circular imports at module load; UTC-naive matches
        # SQLite CURRENT_TIMESTAMP and src.dates storage convention.
        from ...dates import utc_now_naive

        return ColumnField(
            default=...,
            default_factory=utc_now_naive,
            use_current_timestamp=True,
            *args,
            **kwargs,
        )
    else:
        return ColumnField(
            default=None, use_current_timestamp=False, *args, **kwargs
        )


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
    template: str | None = None,
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
            "template": template,
        },
    )
