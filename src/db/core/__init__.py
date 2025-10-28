# This will be the core functionality of the database.
import logging
from typing import Any, Optional
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
        self.logger: logging.Logger = logging.getLogger(__name__)

    def log_error(self, message: str):
        if self.logger:
            self.logger.error(message)

    def log_info(self, message: str):
        if self.logger:
            self.logger.info(message)

    def log_debug(self, message: str):
        if self.logger:
            self.logger.debug(message)

    def run_create(
        self,
        query: str,
        params: tuple,
        exception_package: ExceptionPackage,
    ) -> int:
        with self.get_db_connection() as conn:
            cursor = conn.cursor()
            self.log_debug(
                f"Executing create query: {query} with params: {params}"
            )
            try:
                cursor.execute(query, params)
                if not cursor.lastrowid:
                    raise ValueError("Failed to create entry")
                return cursor.lastrowid
            except sqlite3.IntegrityError as e:
                if "UNIQUE constraint failed" in str(e):
                    self.log_error(
                        f"{exception_package.unique_constraint_error}: {e}"
                    )
                    raise UniqueConstraintError(
                        exception_package.unique_constraint_error
                    )
                if "FOREIGN KEY constraint failed" in str(e):
                    self.log_error(
                        f"{exception_package.foreign_key_constraint_error}: {e}"
                    )
                    raise ForeignKeyConstraintError(
                        exception_package.foreign_key_constraint_error
                    )
                raise e

    def run_update(
        self,
        query: str,
        params: tuple,
        exception_package: ExceptionPackage,
    ):
        self.log_debug(
            f"Executing update query: {query} with params: {params}"
        )
        with self.get_db_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute(query, params)
                if cursor.rowcount == 0:
                    raise NotFoundError(exception_package.not_found_error)
            except sqlite3.IntegrityError as e:
                if "UNIQUE constraint failed" in str(e):
                    self.log_error(
                        f"{exception_package.unique_constraint_error}: {e}"
                    )
                    raise UniqueConstraintError(
                        exception_package.unique_constraint_error
                    )
                raise e

    def run_get_by_id(self, query, object_id, model_factory):
        self.log_debug(
            f"Executing get_by_id query: {query} with id: {object_id}"
        )
        with self.get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (object_id,))
            row = cursor.fetchone()
            return model_factory(**row) if row else None

    def run_list(self, query, params, model_factory):
        self.log_debug(
            f"Executing list query: {query} with params: {params}"
        )
        with self.get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [model_factory(**row) for row in rows]

    def run_scalar(self, query, params, default: Any = 0):
        self.log_debug(
            f"Executing scalar query: {query} with params: {params}"
        )
        with self.get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            result = cursor.fetchone()
            return result[0] if result else default

    def run_delete(self, query, object_id, exception_package):
        self.log_debug(
            f"Executing delete query: {query} with id: {object_id}"
        )
        with self.get_db_connection() as conn:
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
