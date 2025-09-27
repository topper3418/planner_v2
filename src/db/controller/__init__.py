from .category_base import CategoryFilter
from .thing_categories import ThingCategory, ThingCategoryManager
from .ticket_categories import TicketCategory, TicketCategoryManager
from .action_types import ActionType, ActionTypeManager
from .actions import Action, ActionManager, ActionParams
from .comments import Comment, CommentManager, CommentFilter
from .things import Thing, ThingManager, ThingParams
from .tickets import Ticket, TicketManager, TicketParams


Thing.model_rebuild()
Ticket.model_rebuild()
Action.model_rebuild()


class Controller:
    class Objects:
        Thing = Thing
        ThingCategory = ThingCategory
        Ticket = Ticket
        TicketCategory = TicketCategory
        Comment = Comment
        Action = Action
        ActionType = ActionType

    class Managers:
        Thing = ThingManager
        ThingCategory = ThingCategoryManager
        Ticket = TicketManager
        TicketCategory = TicketCategoryManager
        Comment = CommentManager
        Action = ActionManager
        ActionType = ActionTypeManager

    class Params:
        Thing = ThingParams
        Ticket = TicketParams
        Category = CategoryFilter
        Comment = CommentFilter
        Action = ActionParams
