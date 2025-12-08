from .categories import (
    CategoryParams,
    ReadCategoriesResponse,
    ThingCategory,
    TicketCategory,
    ActionType,
)
from .actions import Action, ActionParams, ReadActionsResponse
from .things import Thing, ThingParams, ReadThingsResponse
from .tickets import Ticket, TicketParams, ReadTicketsResponse
from .milestones import Milestone, MilestoneParams, ReadMilestonesResponse
from .schedules import Schedule, ScheduleParams, ReadSchedulesResponse
from .users import User, UserParams, ReadUsersResponse

from .query_builder import QueryBuilder


Thing.model_rebuild()
Ticket.model_rebuild()
Action.model_rebuild()
Schedule.model_rebuild()
User.model_rebuild()


class Controller:
    class Tables:
        Thing = Thing
        ThingCategory = ThingCategory
        Ticket = Ticket
        TicketCategory = TicketCategory
        Action = Action
        ActionType = ActionType
        Milestone = Milestone
        Schedule = Schedule
        User = User

    class Params:
        Thing = ThingParams
        Ticket = TicketParams
        Category = CategoryParams
        Action = ActionParams
        Milestone = MilestoneParams
        Schedule = ScheduleParams
        User = UserParams

    class Responses:
        ReadThings = ReadThingsResponse
        ReadTickets = ReadTicketsResponse
        ReadCategories = ReadCategoriesResponse
        ReadActions = ReadActionsResponse
        ReadMilestones = ReadMilestonesResponse
        ReadSchedules = ReadSchedulesResponse
        ReadUsers = ReadUsersResponse

    QueryBuilder = QueryBuilder
