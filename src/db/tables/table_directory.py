from .actions import Action
from .categories import ActionType, ThingCategory, TicketCategory
from .comments import Comment
from .things import Thing
from .tickets import Ticket


table_directory = {
    "Thing": Thing,
    "ThingCategory": ThingCategory,
    "Ticket": Ticket,
    "TicketCategory": TicketCategory,
    "Comment": Comment,
    "Action": Action,
    "ActionType": ActionType,
}
