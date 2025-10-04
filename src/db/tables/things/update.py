import logging

from ...core import DbCore, ExceptionPackage

from .base import Thing


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def update(thing: Thing) -> None:
    logger.info(f"Updating Thing: {thing}")
    if thing.id is None:
        raise ValueError("Thing ID is required for update")
    query = (
        "UPDATE things SET "
        "category_id = ?, "
        "parent_id = ?, "
        "name = ?, "
        "description = ?, "
        "docs_link = ? "
        "WHERE id = ? "
    )
    params = (
        thing.category_id,
        thing.parent_id,
        thing.name,
        thing.description,
        thing.docs_link,
        thing.id,
    )
    exception_package = ExceptionPackage(
        unique_constraint_error=f"Thing name '{thing.name}' already exists",
        foreign_key_constraint_error=f"Invalid category_id: {thing.category_id}",
        not_found_error=f"Thing with ID {thing.id} not found",
    )
    core.run_update(query, params, exception_package)
