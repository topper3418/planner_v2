import logging
from typing import Optional, List

from ...core import DbCore


from .base import Ticket
from .params import TicketParams


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def get_count(
    query_params: Optional[TicketParams] = None,
) -> List[Ticket]:
    logger.debug(f"Listing tickets with filters: {query_params}")
    from ..query_builder import QueryBuilder

    builder = QueryBuilder(Ticket, query_params)
    builder.build_full()
    query = builder.count_query
    args = tuple(builder.args)
    logger.debug("Ticket count Query: %s \n Args: %s", query, args)
    tickets = core.run_scalar(query, args)
    return tickets
