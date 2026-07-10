import logging
from datetime import date

from ....dates import app_today, to_app_date
from ...core import DbCore

from .base import Ticket


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def get_most_recent_completion_date(ticket_id: int) -> date | None:
    from ..actions import Action, ActionParams

    actions = Action.read(
        ActionParams(  # type: ignore
            ticket_id=ticket_id,
            action_type_name="Completed",
            page_number=1,
            page_size=1000,
        )
    )
    if actions.count == 0:
        return None

    performed_at_values = [
        action.performed_at
        for action in actions.data
        if action.performed_at is not None
    ]
    if not performed_at_values:
        return None

    most_recent = max(performed_at_values)
    # Stored timestamps are naive UTC; convert to app calendar day.
    return to_app_date(most_recent)


def should_show_scheduled_occurrence(
    ticket: Ticket,
    occurrence_date: date,
    today: date | None = None,
) -> bool:
    if today is None:
        today = app_today()

    last_completed_on = get_most_recent_completion_date(ticket.id)  # type: ignore

    if last_completed_on is None:
        return True

    if occurrence_date <= last_completed_on:
        return False

    if ticket.open:
        return True

    return occurrence_date > today
