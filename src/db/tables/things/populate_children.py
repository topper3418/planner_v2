import logging
from typing import Optional

from ...core import DbCore


from .base import Thing


logger = logging.getLogger(__name__)


DbCore.logger = logger


def populate_children(
    thing: "Thing", recursive: Optional[bool] = False
) -> None:
    if thing.id is None:
        thing.children = []
        return
    query = "SELECT id, category_id, name, description, docs_link, parent_id FROM things WHERE parent_id = ?"
    thing.children = DbCore.run_list(query, (thing.id,), Thing)
    if recursive:
        for child in thing.children:
            populate_children(child, recursive=True)
