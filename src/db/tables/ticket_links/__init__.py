from ..util import as_classmethod, as_staticmethod

from .base import TicketLink
from .create import create
from .read import read_ticket_links, ReadTicketLinkResponse
from .update import update
from .delete import delete
from .from_row import from_row
from .params import TicketLinkParams


# attach CRUD functions to TicketLink class
setattr(TicketLink, "create", create)
setattr(TicketLink, "read", as_staticmethod(read_ticket_links))
setattr(TicketLink, "update", update)
setattr(TicketLink, "delete", as_staticmethod(delete))
setattr(TicketLink, "from_row", as_classmethod(from_row))
TicketLink.__params_class__ = TicketLinkParams
TicketLink.__table_name__ = "ticket_links"


__all__ = ["TicketLink", "TicketLinkParams", "ReadTicketLinkResponse"]
