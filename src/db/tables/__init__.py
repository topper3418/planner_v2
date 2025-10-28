from .categories import (
    CategoryParams,
    ReadCategoriesResponse,
    ThingCategory,
    TicketCategory,
    ActionType,
)
from .actions import Action, ActionParams, ReadActionsResponse
from .comments import Comment, CommentParams, ReadCommentsResponse
from .things import Thing, ThingParams, ReadThingsResponse
from .tickets import Ticket, TicketParams, ReadTicketsResponse

from .query_builder import QueryBuilder


Thing.model_rebuild()
Ticket.model_rebuild()
Action.model_rebuild()
Comment.model_rebuild()


class Controller:
    class Tables:
        Thing = Thing
        ThingCategory = ThingCategory
        Ticket = Ticket
        TicketCategory = TicketCategory
        Comment = Comment
        Action = Action
        ActionType = ActionType

    class Params:
        Thing = ThingParams
        Ticket = TicketParams
        Category = CategoryParams
        Comment = CommentParams
        Action = ActionParams

    class Responses:
        ReadThings = ReadThingsResponse
        ReadTickets = ReadTicketsResponse
        ReadCategories = ReadCategoriesResponse
        ReadComments = ReadCommentsResponse
        ReadActions = ReadActionsResponse

    QueryBuilder = QueryBuilder
