import logging
from typing import Optional

from ...core import DbCore

from .base import Milestone


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def get_by_id(milestone_id: int) -> Optional[Milestone]:
    logger.info(f"Getting Milestone by ID: {milestone_id}")
    query = "SELECT * FROM milestones WHERE id = ?"
    return core.run_get_by_id(query, milestone_id, Milestone)
