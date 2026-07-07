from datetime import date
import logging

from .daily_guard import mark_scheduler_ran_for, scheduler_ran_for
from .scheduler import Scheduler


logger = logging.getLogger(__name__)


def run_scheduled_ticket_reopening(
    date_override: date | None = None,
    *,
    reopen_only_closed: bool = False,
) -> dict:
    """Match today's schedules and reopen their tickets."""
    scheduler = Scheduler(date_override)
    scheduler.read()
    reopened = scheduler.reopen_scheduled_tickets(
        reopen_only_closed=reopen_only_closed,
    )
    return {
        "matching_schedules": [
            {"id": schedule.id, "name": schedule.name}
            for schedule in scheduler.matching_schedules
        ],
        "tickets_processed": len(reopened),
        "tickets": reopened,
    }


def ensure_scheduled_tickets_reopened_for_today() -> dict | None:
    """
    Run the scheduler once per calendar day when the cron worker is unavailable.

    Reopens only closed tickets so repeated calendar loads do not create duplicate
    Reopened actions or mark in-progress tickets overdue.
    """
    today = date.today()
    if scheduler_ran_for(today):
        return None

    logger.info("Running daily scheduled ticket reopening for %s", today)
    result = run_scheduled_ticket_reopening(
        today,
        reopen_only_closed=True,
    )
    mark_scheduler_ran_for(today)
    return result