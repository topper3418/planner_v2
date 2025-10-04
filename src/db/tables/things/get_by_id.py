import logging
from typing import Optional

from ...core import DbCore


from .base import Thing

logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def get_by_id(thing_id: int) -> Optional[Thing]:
    logger.info(f"Getting Thing by ID: {thing_id}")
    query = (
        "SELECT"
        " t.id, t.category_id, t.name, t.description, t.docs_link,"
        " c.name AS category_name, c.description AS category_description"
        " FROM things t"
        " LEFT JOIN thing_categories c ON t.category_id = c.id"
        " WHERE t.id = ?"
    )
    thing = core.run_get_by_id(query, thing_id, Thing.from_row)
    if thing:
        thing.populate_children()
    return thing
