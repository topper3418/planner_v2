import logging

from ...core import DbCore, ExceptionPackage

from .base import User


logger = logging.getLogger(__name__)

core = DbCore()
core.logger = logger


def update(user: User) -> None:
    logger.info(f"Updating User: {user}")
    if user.id is None:
        raise ValueError("User ID is required for update")
    query = "UPDATE users SET username = ? WHERE id = ?"
    params = (
        user.username,
        user.id,
    )
    exception_package = ExceptionPackage(
        not_found_error=f"User with ID {user.id} not found"
    )
    core.run_update(query, params, exception_package)
