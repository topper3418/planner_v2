from . import controller
from datetime import datetime


def seed_database():
    """
    Seed the database with sample data for testing and development.
    Pseudocode:
    1. Create categories, capturing their IDs
    2. Create things linked to categories
    3. Create tickets linked to things and categories
    4. Create comments and actions linked to tickets
    5. Handle errors and print progress
    """
    try:
        # Seed Categories
        categories = [
            controller.Category(name="Hardware", parent_id=None),
            controller.Category(name="Software", parent_id=None),
            controller.Category(
                name="Networking", parent_id=1
            ),  # Child of Hardware
        ]
        category_ids = []
        for cat in categories:
            cat_id = controller.CategoryManager.create(cat)
            category_ids.append(cat_id)
            print(f"Created category: {cat.name} (ID: {cat_id})")

        # Seed Things
        things = [
            controller.Thing(
                name="Laptop",
                category_id=category_ids[0],
                description="High-performance laptop",
                docs_link="http://docs.laptop.com",
            ),
            controller.Thing(
                name="Database",
                category_id=category_ids[1],
                description="SQL database system",
                docs_link="http://docs.db.com",
            ),
            controller.Thing(
                name="Router",
                category_id=category_ids[2],
                description="Wireless router",
                docs_link="http://docs.router.com",
            ),
        ]
        thing_ids = []
        for thing in things:
            thing_id = controller.ThingManager.create(thing)
            thing_ids.append(thing_id)
            print(f"Created thing: {thing.name} (ID: {thing_id})")

        # Seed Tickets
        tickets = [
            controller.Ticket(
                thing_id=thing_ids[0],
                category_id=category_ids[0],
                description="Laptop overheating issue",
                open=True,
                completed_at=None,
            ),
            controller.Ticket(
                thing_id=thing_ids[1],
                category_id=category_ids[1],
                description="Database query optimization needed",
                open=False,
                completed_at=datetime(2025, 9, 18, 10, 0),
            ),
            controller.Ticket(
                thing_id=None,
                category_id=category_ids[2],
                description="Network latency reported",
                open=True,
                completed_at=None,
            ),
        ]
        ticket_ids = []
        for ticket in tickets:
            ticket_id = controller.TicketManager.create(ticket)
            ticket_ids.append(ticket_id)
            print(
                f"Created ticket: {ticket.description[:20]}... (ID: {ticket_id})"
            )

        # Seed Comments
        comments = [
            controller.Comment(
                ticket_id=ticket_ids[0],
                content="Checked thermal paste, needs replacement",
            ),
            controller.Comment(
                ticket_id=ticket_ids[0],
                content="Scheduled maintenance for laptop",
            ),
            controller.Comment(
                ticket_id=ticket_ids[1],
                content="Optimized indexes, testing in progress",
            ),
        ]
        for comment in comments:
            comment_id = controller.CommentManager.create(comment)
            print(
                f"Created comment: {comment.content[:20]}... (ID: {comment_id})"
            )

        # Seed Actions
        actions = [
            controller.Action(
                ticket_id=ticket_ids[0], action_type="Diagnosed"
            ),
            controller.Action(
                ticket_id=ticket_ids[0], action_type="Repaired"
            ),
            controller.Action(
                ticket_id=ticket_ids[1], action_type="Updated"
            ),
        ]
        for action in actions:
            action_id = controller.ActionManager.create(action)
            print(
                f"Created action: {action.action_type} (ID: {action_id})"
            )

        print("Database seeding completed successfully!")
    except Exception as e:
        print(f"Error during seeding: {str(e)}")
        raise
