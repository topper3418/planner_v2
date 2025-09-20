from contextlib import contextmanager
import sqlite3


@contextmanager
def get_db_connection():
    conn = sqlite3.connect("data/database.db")
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except sqlite3.Error as e:
        conn.rollback()
        raise e
    finally:
        conn.close()


def initialize_db():
    # read the schema.sql file
    with open("src/db/schema.sql") as f:
        schema_sql = f.read()
    # split the SQL script into individual statements
    statements = [
        stmt.strip() for stmt in schema_sql.split(";") if stmt.strip()
    ]
    # run each statement
    with get_db_connection() as conn:
        cursor = conn.cursor()
        for statement in statements:
            cursor.execute(statement)
