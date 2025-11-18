import os

from src.db.migrations.add_completed_and_reopened import (
    add_completed_and_reopened_action_types,
)

# set environment variable before importing to suppress the
# init schema setup


if __name__ == "__main__":
    os.environ["DB_MIGRATION"] = "true"
    from src.db.migrations import (
        add_users_and_milestones_tables,
        diff_check,
        backup_db,
    )

    # backup the database before running migrations
    pre_migration_backup = backup_db("data/database_migration_backup.db")
    # add_users_and_milestones_tables()
    add_completed_and_reopened_action_types()
    # duplicate the database after migration for diff check
    post_migration_backup = backup_db()
    # remove the current database in order to build one fresh from the schema to make sure they match
    os.remove("data/database.db")
    # change the environment variable to false to allow init to setup the schema
    os.environ["DB_MIGRATION"] = "false"
    from src.db import DbCore  # noqa: E402

    diff_check(post_migration_backup)
    # finally, copy the pre-migration backup back to the main database file
    os.replace(post_migration_backup, "data/database.db")
