from typing import Optional
from .. import Controller


TicketCategory = Controller.Tables.TicketCategory
Thing = Controller.Tables.Thing
Ticket = Controller.Tables.Ticket


def seed_tickets(thing_id_lookup):
    # Seed Ticket Categories
    ticket_categories = [
        TicketCategory(name="Improvement"),
        TicketCategory(name="Maintenance"),
        TicketCategory(name="Learning"),
        TicketCategory(name="Repair"),
        TicketCategory(name="Admin"),
    ]

    ticket_category_id_lookup = {}
    for cat in ticket_categories:
        cat_id = cat.create()
        ticket_category_id_lookup[cat.name] = cat_id
        print(f"Created ticket category: {cat.name} (ID: {cat_id})")

    def get_ticket_category_id(name):
        return ticket_category_id_lookup.get(name)

    ticket_id_lookup = {}

    def add_ticket(
        title: str,
        thing: str,
        category: str,
        description: Optional[str] = None,
        open: Optional[bool] = True,
        parent: Optional[str] = None,
    ):
        thing_id = thing_id_lookup.get(thing)
        category_id = get_ticket_category_id(category)
        parent_id = ticket_id_lookup.get(parent) if parent else None
        ticket = Ticket(
            title=title,
            thing_id=thing_id,
            category_id=category_id,
            description=description,
            open=open,
            parent_id=parent_id,
        )
        ticket_id = ticket.create()
        ticket_id_lookup[ticket.title] = ticket_id
        print(f"Created ticket: {ticket.title} (ID: {ticket_id})")
        return ticket_id

    add_ticket(
        title="Fix leaking pool pump",
        thing="Pool",
        category="Repair",
        description="The pool pump is leaking water and needs to be fixed.",
        open=True,
    )

    add_ticket(
        title="Upgrade laptop RAM",
        thing="Laptop",
        category="Improvement",
        description="Upgrade the laptop RAM from 8GB to 16GB for better performance.",
        open=True,
    )

    add_ticket(
        title="Annual truck maintenance",
        thing="Truck",
        category="Maintenance",
        description="Schedule and perform annual maintenance on the truck.",
        open=True,
    )

    add_ticket(
        title="Learn SQL basics",
        thing="Database",
        category="Learning",
        description="Take an online course to learn the basics of SQL.",
        open=True,
    )

    add_ticket(
        title="Organize garden tools",
        thing="Garden",
        category="Maintenance",
        description="Clean and organize all garden tools in the shed.",
        open=True,
    )

    add_ticket(
        title="Set up home office",
        thing="House",
        category="Improvement",
        description="Create a dedicated workspace in the house for remote work.",
        open=True,
    )

    add_ticket(
        title="Backup important files",
        thing="Laptop",
        category="Admin",
        description="Ensure all important files are backed up to the cloud.",
        open=True,
    )

    add_ticket(
        title="Fix garden fence",
        thing="Garden",
        category="Repair",
        description="Repair the broken section of the garden fence.",
        open=True,
    )

    add_ticket(
        title="Replace couch cushions",
        thing="Couch",
        category="Improvement",
        description="Buy and replace the worn-out cushions on the living room couch.",
        open=True,
    )

    add_ticket(
        title="SUV tire rotation",
        thing="SUV",
        category="Maintenance",
        description="Rotate the tires on the SUV for even wear.",
        open=True,
    )

    return ticket_id_lookup
