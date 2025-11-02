import logging

from ...core import DbCore, ExceptionPackage

from .base import Milestone


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def remove_ticket(milestone: Milestone, ticket_id: int) -> None:
    logger.info(
        f"Removing ticket ID {ticket_id} from milestone ID {milestone.id}"
    )
    if milestone.id is None:
        raise ValueError("Milestone ID is required to add a ticket")
    query = "DELETE FROM ticket_milestones WHERE milestone_id = ? AND ticket_id = ?"
    params = (milestone.id, ticket_id)
    exception_package = ExceptionPackage()
    core.run_update(query, params, exception_package)
