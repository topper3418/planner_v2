import logging

from ...core import DbCore


from .base import Thing


logger = logging.getLogger(__name__)


DbCore.logger = logger


def populate_children(thing: "Thing") -> None:
    if thing.id is None:
        thing.children = []
        return
    query = "SELECT id, category_id, name, description, docs_link, parent_id FROM things WHERE parent_id = ?"
    thing.children = DbCore.run_list(query, (thing.id,), Thing)
