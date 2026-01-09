import logging
from datetime import date, datetime

from ...core import DbCore

from .base import Ticket


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def has_been_completed_since(ticket: Ticket, date_in: date) -> bool:
    # don't bother if date is in the future
    if date_in > date_in.today():
        return False
    # see if there are any completion actions since the date
    from ..actions import Action, ActionParams

    query_params = ActionParams(
        ticket_id=ticket.id,
        action_type_name="Completed",
        performed_after=datetime.combine(date_in, datetime.min.time()),
        page_number=1,
        page_size=1,
    )
    actions = Action.read(query_params)
    if actions.count > 0:
        return True
    return False
