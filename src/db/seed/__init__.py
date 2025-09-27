from .seed_things import seed_things
from .seed_tickets import seed_tickets
from .seed_comments import seed_comments
from .seed_actions import seed_actions


def seed_database():
    thing_id_lookup = seed_things()
    ticket_id_lookup = seed_tickets(thing_id_lookup)
    comment_id_lookup = seed_comments(ticket_id_lookup)
    action_id_lookup = seed_actions(ticket_id_lookup)
