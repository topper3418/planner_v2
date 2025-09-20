import os

from .db import controller
from .app import app
from .logging import setup_logging


# ensure that the data/ directory exists
os.makedirs("data", exist_ok=True)


# Call setup at import
setup_logging()


__all__ = ["controller", "app"]
