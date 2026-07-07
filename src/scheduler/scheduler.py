from datetime import date
import logging
from ..db.tables import (
    ReadSchedulesResponse,
    ScheduleParams,
    Schedule,
    Action,
    ActionType,
    Ticket,
)
from .today import Today


logger = logging.getLogger(__name__)


class Scheduler:

    def __init__(self, date_override: date | None = None):
        self.today = Today()
        if date_override:
            self.today.set_date(date_override)
        self.matching_schedules: list[Schedule] = []
        self.regen_tickets: list[Ticket] = []

    def read(self):
        self.matching_schedules = self.check_schedules()
        self.regen_tickets = self.get_regen_tickets()

    def check_schedules(self) -> list[Schedule]:
        today = self.today
        matching_schedules: list[Schedule] = []
        schedules: ReadSchedulesResponse = Schedule.read(ScheduleParams(page_size=10000))  # type: ignore
        for schedule in schedules.data:
            if today.check_schedule(schedule):
                matching_schedules.append(schedule)
        return matching_schedules

    def get_regen_tickets(self) -> list[Ticket]:
        regen_tickets: list[Ticket] = []
        for schedule in self.matching_schedules:
            schedule.populate_tickets()  # type: ignore
            for ticket in schedule.tickets:  # type: ignore
                regen_tickets.append(ticket)
        return regen_tickets

    def reopen_scheduled_tickets(
        self,
        *,
        reopen_only_closed: bool = False,
    ) -> list[dict]:
        reopen_action_type = ActionType.get_by_name("Reopened")  # type: ignore
        reopened: list[dict] = []
        for ticket in self.regen_tickets:
            ticket_already_open = ticket.open
            if reopen_only_closed and ticket_already_open:
                continue

            logger.info(
                f"Reopening ticket {ticket.title} (ID: {ticket.id})"
            )
            reopen_action = Action(
                action_type_id=reopen_action_type.id,
                ticket_id=ticket.id,
                action_text="Ticket reopened by scheduler.",
            )
            Action.create(reopen_action)
            # if the ticket is already open, it's overdue
            if ticket_already_open:
                print(
                    f"Ticket {ticket.title} is already open, marking as overdue."
                )
                ticket.overdue = True
                ticket.update()
            reopened.append({
                "id": ticket.id,
                "title": ticket.title,
                "was_open": ticket_already_open,
                "marked_overdue": ticket_already_open,
            })
        return reopened
