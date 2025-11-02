import logging

from ...core import DbCore, ExceptionPackage

from .base import Milestone


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def add_ticket(milestone: Milestone, ticket_id: int) -> None:
    logger.info(
        f"Adding Ticket ID {ticket_id} to Milestone ID {milestone.id}"
    )
    if milestone.id is None:
        raise ValueError("Milestone ID is required to add a ticket")
    query = "INSERT INTO ticket_milestones (milestone_id, ticket_id) VALUES (?, ?)"
    params = (milestone.id, ticket_id)
    exception_package = ExceptionPackage()
    core.run_update(query, params, exception_package)
