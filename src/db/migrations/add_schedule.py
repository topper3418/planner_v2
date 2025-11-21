from src.db.tables import ActionType
from ..core.get_connection import get_db_connection


def add_schedule():
    # add the new schedule table
    schedule_table_create = """
    CREATE TABLE IF NOT EXISTS schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        weekdays TEXT,
        monthdays TEXT,
        yeardays TEXT
    );
    """
    schedule_col_add = """
    ALTER TABLE tickets
        ADD COLUMN schedule_id INTEGER
        REFERENCES schedules(id);
    """
    with get_db_connection() as conn:
        conn.execute(schedule_table_create)
        print("Schedule table added.")
        conn.execute(schedule_col_add)
        print("Schedule ID column added to tickets table.")
        conn.commit()
        print("Changes committed.")
