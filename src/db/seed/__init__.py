from .seed_things import seed_things
from .seed_tickets import seed_tickets
from .seed_actions import seed_actions
from .seed_ticket_link_types import seed_ticket_link_types


def seed_database(dev=True):
    """Seed the database with initial data.
    If dev is True, seed with development data as well.
    if not dev, just add the default categories.
    """
    if not dev:
        thing_id_lookup = seed_things()
        ticket_id_lookup = seed_tickets(thing_id_lookup)
        seed_actions(ticket_id_lookup, dev=dev)
        seed_ticket_link_types()
    else:
        seed_actions(dev=dev)
        seed_ticket_link_types()
