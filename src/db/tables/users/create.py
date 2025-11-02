import logging

from ...core import DbCore, ExceptionPackage

from .base import User

logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def create(user: User) -> int:
    logger.info(f"Creating new user: {user}")
    query = "INSERT INTO users (username) VALUES (?);"
    params = (user.username,)
    exception_package = ExceptionPackage()
    last_row_id = core.run_create(query, params, exception_package)
    user.id = last_row_id
    return last_row_id
