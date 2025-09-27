from .controller import Controller
from .core import DbCore


class Database:
    Controller = Controller()
    # initialize the database core to ensure
    # the database and tables are created
    Core = DbCore()
