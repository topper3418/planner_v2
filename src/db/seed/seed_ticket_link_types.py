from typing import Optional

from .. import Controller

TicketLinkType = Controller.Tables.TicketLinkType


def seed_ticket_link_types(dev=True):
    # INSERT INTO ticket_link_types (name, description, is_default, color) VALUES
    # ('Documentation', 'Links to documentation related to the ticket', 1, '#3498db'),
    # ('Related Ticket', 'Links to another related ticket', 1, '#2ecc71'),
    # ('Photos', 'Links to photos related to the ticket', 1, '#9b59b6'),
    # ('Web Link', 'Links to an external resource', 1, '#e67e22');
    ticket_link_types = [
        (
            "Documentation",
            "Links to documentation related to the ticket",
            True,
            "#3498db",
        ),
        (
            "Related Ticket",
            "Links to another related ticket",
            True,
            "#2ecc71",
        ),
        (
            "Photos",
            "Links to photos related to the ticket",
            True,
            "#9b59b6",
        ),
        ("Web Link", "Links to an external resource", True, "#e67e22"),
    ]
    for name, description, is_default, color in ticket_link_types:
        link_type = TicketLinkType(
            name=name,
            description=description,
            is_default=is_default,
            color=color,
        )
        link_type_id = link_type.create()
        print(f"Created ticket link type: {name} (ID: {link_type_id})")
