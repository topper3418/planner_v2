from .base import Ticket


def from_row(cls, **row) -> Ticket:
    ticket = cls(
        id=row["id"],
        title=row["title"],
        description=row["description"],
        open=row["open"],
        overdue=row["overdue"],
        thing_id=row["thing_id"],
        category_id=row["category_id"],
        parent_id=row["parent_id"],
        created_at=row["created_at"],
        updated_at=row["updated_at"],
        completed_at=row["completed_at"],
        user_id=row["user_id"],
        schedule_id=row["schedule_id"],
    )
    if "thing_name" in row.keys():
        from ..things import Thing

        ticket.thing = Thing(
            id=row["thing_id"],
            name=row.get("thing_name") or "No Thing",
            description=row.get("thing_description", None),
            docs_link=row.get("thing_docs_link", None),
            parent_id=row.get("thing_parent_id", None),
            category_id=row.get("thing_category_id", None),
        )
    if "category_name" in row.keys():
        from ..categories import TicketCategory

        ticket.category = TicketCategory(
            id=row["category_id"],
            name=row.get("category_name", ""),
            description=row.get("category_description", None),
            is_default=row.get("category_is_default", False),
            color=row.get("category_color", None),
        )
    if "user_username" in row.keys():
        from ..users import User

        ticket.user = User(
            id=row["user_id"],
            username=row.get("user_username", "Unknown User"),
        )
    if "schedule_name" in row.keys():
        from ..schedules import Schedule

        ticket.schedule = Schedule(
            id=row["schedule_id"],
            name=row.get("schedule_name", "Unnamed Schedule"),
            weekdays=row.get("schedule_weekdays", None),
            monthdays=row.get("schedule_monthdays", None),
            yeardays=row.get("schedule_yeardays", None),
        )
    return ticket
