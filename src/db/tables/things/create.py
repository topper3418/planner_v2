import logging

from ...core import DbCore, ExceptionPackage

from .base import Thing


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def create(thing: Thing) -> int:
    logger.info(f"Creating new Thing: {thing}")
    query = "INSERT INTO things (category_id, name, description, docs_link, parent_id) VALUES (?, ?, ?, ?, ?)"
    params = (
        thing.category_id,
        thing.name,
        thing.description,
        thing.docs_link,
        thing.parent_id,
    )
    exception_package = ExceptionPackage(
        unique_constraint_error=f"Thing name '{thing.name}' already exists",
        foreign_key_constraint_error=f"Invalid category_id: {thing.category_id}",
    )
    thing_id = core.run_create(query, params, exception_package)
    return thing_id
