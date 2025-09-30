from ..util import as_classmethod, as_staticmethod

from .base import Action
from .create import create
from .get_by_id import get_by_id
from .read import read_actions
from .update import update
from .delete import delete
from .from_row import from_row
from .params import ActionParams


# attach CRUD functions to Action class
setattr(Action, "create", create)
setattr(Action, "get_by_id", as_staticmethod(get_by_id))
setattr(Action, "read", as_staticmethod(read_actions))
setattr(Action, "update", update)
setattr(Action, "delete", as_staticmethod(delete))
setattr(Action, "from_row", as_classmethod(from_row))


__all__ = ["Action", "ActionParams"]
