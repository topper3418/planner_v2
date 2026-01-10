from .base import TicketLink


def from_row(cls, **row) -> TicketLink:
    action = cls(
        id=row["id"],
        ticket_id=row["ticket_id"],
        link_type_id=row["link_type_id"],
        label=row["label"],
        link=row["link"],
    )
    if "ticket_title" in row.keys():
        from ..tickets import Ticket

        action.ticket = Ticket(
            id=row["ticket_id"],
            title=row.get("ticket_title", None),
            description=row.get("ticket_description", None),
            open=row.get("ticket_open", None),
            thing_id=row.get("ticket_thing_id", None),
            category_id=row.get("ticket_category_id", None),
            parent_id=row.get("ticket_parent_id", None),
            created_at=row.get("ticket_created_at", None),
            updated_at=row.get("ticket_updated_at", None),
            completed_at=row.get("ticket_completed_at", None),
        )
    if "link_type_name" in row.keys():
        from ..categories import TicketLinkType

        action.action_type = TicketLinkType(
            id=row["link_type_id"],
            name=row.get("link_type_name", None),
            description=row.get("link_type_description", None),
            is_default=row.get("link_type_is_default", False),
            color=row.get("link_type_color", None),
        )
    return action
