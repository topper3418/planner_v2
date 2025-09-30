from ..util import as_classmethod, as_staticmethod


from .base import Thing
from .from_row import from_row
from .populate_children import populate_children
from .params import ThingParams
from .create import create
from .update import update
from .get_by_id import get_by_id
from .read import read
from .delete import delete


# attach CRUD functions to Thing class
setattr(Thing, "create", create)
setattr(Thing, "update", update)
setattr(Thing, "populate_children", populate_children)
setattr(Thing, "get_by_id", as_staticmethod(get_by_id))
setattr(Thing, "read", as_staticmethod(read))
setattr(Thing, "delete", as_staticmethod(delete))
setattr(Thing, "from_row", as_classmethod(from_row))


__all__ = ["Thing", "ThingParams"]
