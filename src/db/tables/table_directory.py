from typing import Type

from .table_model import TableModel
from .actions import Action
from .categories import ActionType, ThingCategory, TicketCategory
from .things import Thing
from .tickets import Ticket
from .users import User


table_directory: dict[str, Type[TableModel]] = {
    "Thing": Thing,
    "ThingCategory": ThingCategory,
    "Ticket": Ticket,
    "TicketCategory": TicketCategory,
    "Action": Action,
    "ActionType": ActionType,
    "User": User,
}
