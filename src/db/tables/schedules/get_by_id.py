import logging
from typing import Optional

from ...core import DbCore

from .base import Schedule


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def get_by_id(schedule_id: int) -> Optional[Schedule]:
    logger.info(f"Getting Schedule by ID: {schedule_id}")
    query = "SELECT * FROM schedules WHERE id = ?"
    return core.run_get_by_id(query, schedule_id, Schedule)
