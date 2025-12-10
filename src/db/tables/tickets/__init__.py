from ..util import as_staticmethod, as_classmethod

from .base import Ticket
from .from_row import from_row
from .populate_children import populate_children
from .params import TicketParams
from .create import create
from .update import update
from .get_by_id import get_by_id
from .read import read, ReadTicketsResponse
from .delete import delete
from .get_count import get_count
from .add_milestone import add_milestone
from .remove_milestone import remove_milestone
from .populate_milestones import populate_milestones
from .populate_category import populate_category


# attach CRUD functions to Ticket class
setattr(Ticket, "create", create)
setattr(Ticket, "update", update)
setattr(Ticket, "populate_children", populate_children)
setattr(Ticket, "from_row", as_classmethod(from_row))
setattr(Ticket, "get_by_id", as_staticmethod(get_by_id))
setattr(Ticket, "read", as_staticmethod(read))
setattr(Ticket, "get_count", as_staticmethod(get_count))
setattr(Ticket, "delete", as_staticmethod(delete))
setattr(Ticket, "add_milestone", add_milestone)
setattr(Ticket, "remove_milestone", remove_milestone)
setattr(Ticket, "populate_milestones", populate_milestones)
setattr(Ticket, "populate_category", populate_category)
Ticket.__params_class__ = TicketParams
Ticket.__table_name__ = "tickets"


__all__ = ["Ticket", "TicketParams", "ReadTicketsResponse"]
