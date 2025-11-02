import logging
from typing import Optional

from ...core import DbCore

from .base import User


logger = logging.getLogger(__name__)


core = DbCore()
core.logger = logger


def get_by_id(user_id: int) -> Optional[User]:
    logger.info(f"Getting User by ID: {user_id}")
    query = "SELECT * FROM users WHERE id = ?"
    return core.run_get_by_id(query, user_id, User)
