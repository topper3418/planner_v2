from src.db.tables import ActionType
from ..core.get_connection import get_db_connection


def add_completed_and_reopened_action_types():
    completed = ActionType(
        name="Completed", description="Finished the ticket"
    )
    reopened = ActionType(
        name="Reopened", description="Reopened a previously closed ticket"
    )
    completed.create()
    print("Added 'Completed' action type.")
    reopened.create()
    print("Added 'Reopened' action type.")
