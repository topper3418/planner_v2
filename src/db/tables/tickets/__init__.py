from ..util import as_staticmethod, as_classmethod

from .base import Ticket
from .from_row import from_row
from .populate_children import populate_children
from .params import TicketParams
from .create import create
from .update import update
from .get_by_id import get_by_id
from .read import read
from .delete import delete


# attach CRUD functions to Ticket class
setattr(Ticket, "create", create)
setattr(Ticket, "update", update)
setattr(Ticket, "populate_children", populate_children)
setattr(Ticket, "from_row", as_classmethod(from_row))
setattr(Ticket, "get_by_id", as_staticmethod(get_by_id))
setattr(Ticket, "read", as_staticmethod(read))
setattr(Ticket, "delete", as_staticmethod(delete))


__all__ = ["Ticket", "TicketParams"]
