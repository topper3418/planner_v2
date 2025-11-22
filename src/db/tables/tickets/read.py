import logging
from typing import Optional, List

from pydantic import BaseModel

from ...core import DbCore

from .base import Ticket
from .params import TicketParams


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


class ReadTicketsResponse(BaseModel):
    data: List[Ticket]
    count: int


def read(
    query_params: Optional[TicketParams] = None,
) -> ReadTicketsResponse:
    logger.debug(f"Listing tickets with filters: {query_params}")
    from ..query_builder import QueryBuilder

    builder = QueryBuilder(Ticket, query_params)
    builder.build_full()
    query = builder.query
    count_query = builder.count_query
    args = tuple(builder.args)
    logger.debug("Ticket Read Query: %s \n Args: %s", query, args)
    tickets = core.run_list(query, args, Ticket.from_row)
    count = core.run_scalar(count_query, args)
    if query_params and "children" in query_params.include:
        for ticket in tickets:
            ticket.populate_children()
    return ReadTicketsResponse(data=tickets, count=count)
