# This will be the core functionality of the database.
import logging
from typing import Optional
from functools import partial
from pydantic import BaseModel
import sqlite3

from .get_connection import get_db_connection


class UniqueConstraintError(Exception):
    pass


class ForeignKeyConstraintError(Exception):
    pass


class NotFoundError(Exception):
    pass


class ExceptionPackage(BaseModel):
    unique_constraint_error: Optional[str] = None
    foreign_key_constraint_error: Optional[str] = None
    not_found_error: Optional[str] = None


class DbCore:
    __db_filepath__ = "data/database.db"
    __schema_filepath__ = "src/db/schema.sql"

    get_db_connection = staticmethod(
        partial(get_db_connection, db_path=__db_filepath__)
    )
    logger = logging.getLogger(__name__)

    # schema is a list of DDL statements for each table
    with open(__schema_filepath__) as f:
        schema = [
            stmt.strip() for stmt in f.read().split(";") if stmt.strip()
        ]

    def __init__(self):
        with self.get_db_connection() as conn:
            cursor = conn.cursor()
            for statement in self.schema:
                cursor.execute(statement)

    @classmethod
    def log_error(cls, message: str):
        if cls.logger:
            cls.logger.error(message)

    @classmethod
    def log_info(cls, message: str):
        if cls.logger:
            cls.logger.info(message)

    @classmethod
    def log_debug(cls, message: str):
        if cls.logger:
            cls.logger.debug(message)

    @classmethod
    def run_create(
        cls,
        query: str,
        params: tuple,
        exception_package: ExceptionPackage,
    ) -> int:
        with cls.get_db_connection() as conn:
            cursor = conn.cursor()
            cls.log_debug(
                f"Executing create query: {query} with params: {params}"
            )
            try:
                cursor.execute(query, params)
                if not cursor.lastrowid:
                    raise ValueError("Failed to create entry")
                return cursor.lastrowid
            except sqlite3.IntegrityError as e:
                if "UNIQUE constraint failed" in str(e):
                    cls.log_error(
                        f"{exception_package.unique_constraint_error}: {e}"
                    )
                    raise UniqueConstraintError(
                        exception_package.unique_constraint_error
                    )
                if "FOREIGN KEY constraint failed" in str(e):
                    cls.log_error(
                        f"{exception_package.foreign_key_constraint_error}: {e}"
                    )
                    raise ForeignKeyConstraintError(
                        exception_package.foreign_key_constraint_error
                    )
                raise e

    @classmethod
    def run_update(
        cls, query: str, params: tuple, exception_package: ExceptionPackage
    ):
        cls.log_debug(
            f"Executing update query: {query} with params: {params}"
        )
        with cls.get_db_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute(query, params)
                if cursor.rowcount == 0:
                    raise NotFoundError(exception_package.not_found_error)
            except sqlite3.IntegrityError as e:
                if "UNIQUE constraint failed" in str(e):
                    cls.log_error(
                        f"{exception_package.unique_constraint_error}: {e}"
                    )
                    raise UniqueConstraintError(
                        exception_package.unique_constraint_error
                    )
                raise e

    @classmethod
    def run_get_by_id(cls, query, object_id, model_factory):
        cls.log_debug(
            f"Executing get_by_id query: {query} with id: {object_id}"
        )
        with cls.get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (object_id,))
            row = cursor.fetchone()
            return model_factory(**row) if row else None

    @classmethod
    def run_list(cls, query, params, model_factory):
        cls.log_debug(
            f"Executing list query: {query} with params: {params}"
        )
        with cls.get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [model_factory(**row) for row in rows]

    @classmethod
    def run_delete(cls, query, object_id, exception_package):
        cls.log_debug(
            f"Executing delete query: {query} with id: {object_id}"
        )
        with cls.get_db_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute(query, (object_id,))
                if cursor.rowcount == 0:
                    raise NotFoundError(exception_package.not_found_error)
            except sqlite3.IntegrityError as e:
                if "FOREIGN KEY constraint failed" in str(e):
                    raise ForeignKeyConstraintError(
                        exception_package.foreign_key_constraint_error
                    )
                raise e
