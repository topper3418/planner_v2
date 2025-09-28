import logging

from ...core import DbCore, ExceptionPackage


from .base import Thing


logger = logging.getLogger(__name__)


DbCore.logger = logger


def create(thing: Thing) -> int:
    logger.info(f"Creating new Thing: {thing}")
    query = "INSERT INTO things (category_id, name, description, docs_link) VALUES (?, ?, ?, ?)"
    params = (
        thing.category_id,
        thing.name,
        thing.description,
        thing.docs_link,
    )
    exception_package = ExceptionPackage(
        unique_constraint_error=f"Thing name '{thing.name}' already exists",
        foreign_key_constraint_error=f"Invalid category_id: {thing.category_id}",
    )
    thing_id = DbCore.run_create(query, params, exception_package)
    thing.id = thing_id
    return thing_id
