from datetime import date

from .scheduler import Scheduler


def run_scheduled_ticket_reopening(
    date_override: date | None = None,
) -> dict:
    """Match today's schedules and reopen their tickets."""
    scheduler = Scheduler(date_override)
    scheduler.read()
    reopened = scheduler.reopen_scheduled_tickets()
    return {
        "matching_schedules": [
            {"id": schedule.id, "name": schedule.name}
            for schedule in scheduler.matching_schedules
        ],
        "tickets_processed": len(reopened),
        "tickets": reopened,
    }