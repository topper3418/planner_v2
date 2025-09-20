import logging
import os
from logging.handlers import RotatingFileHandler


def setup_logging():
    # Setting up logger
    logger = logging.getLogger("planner")
    logger.setLevel(logging.DEBUG)

    # Prevent duplicate handlers
    if not logger.handlers:
        # Creating formatter
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )

        # Console handler (togglable via env var)
        if os.getenv("CONSOLE_LOGGING", "true").lower() == "true":
            console_handler = logging.StreamHandler()
            console_handler.setLevel(logging.DEBUG)
            console_handler.setFormatter(formatter)
            logger.addHandler(console_handler)

        # File handler with rotation
        file_handler = RotatingFileHandler(
            "data/app.log", maxBytes=1000000, backupCount=5
        )
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)


__all__ = ["setup_logging"]
