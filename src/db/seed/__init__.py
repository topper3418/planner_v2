from .seed_things import seed_things
from .seed_tickets import seed_tickets
from .seed_comments import seed_comments
from .seed_actions import seed_actions


def seed_database(dev=True):
    """Seed the database with initial data.
    If dev is True, seed with development data as well.
    if not dev, just add the default categories.
    """
    thing_id_lookup = seed_things(dev=dev)
    ticket_id_lookup = seed_tickets(thing_id_lookup, dev=dev)
    seed_actions(ticket_id_lookup, dev=dev)
    if dev:
        seed_comments(ticket_id_lookup, dev=dev)
