import logging
from typing import Optional

from pydantic import BaseModel

from ...core import DbCore

from .base import TicketLink
from .params import TicketLinkParams


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


class ReadTicketLinkResponse(BaseModel):
    data: list[TicketLink]
    count: int


def read_ticket_links(
    query_params: Optional[TicketLinkParams] = None,
) -> ReadTicketLinkResponse:
    logger.debug(f"Listing ticket links with filters: {query_params}")
    from ..query_builder import QueryBuilder

    builder = QueryBuilder(TicketLink, query_params)
    builder.build_full()
    query = builder.query
    count_query = builder.count_query
    params = tuple(builder.args)
    logger.debug("Ticket Link Read Query: %s \n Args: %s", query, params)
    ticket_links = core.run_list(query, tuple(params), TicketLink.from_row)
    count = core.run_scalar(count_query, tuple(params))
    logger.debug("Total actions found: %d", count)
    return ReadTicketLinkResponse(data=ticket_links, count=count)
