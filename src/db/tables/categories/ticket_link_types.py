import logging

from .category_base import Category


logger = logging.getLogger(__name__)


# Pydantic model for Category
class TicketLinkType(Category):
    __table_name__ = "ticket_link_types"
    __logger__ = logger
