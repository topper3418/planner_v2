import sqlite3
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from ..util import get_db_connection


# Pydantic model for Ticket
class Ticket(BaseModel):
    id: Optional[int] = None
    thing_id: Optional[int] = None
    category_id: Optional[int] = None
    description: str
    created_at: Optional[datetime] = None
    open: Optional[bool] = True
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Pydantic model for Ticket filter
class TicketFilter(BaseModel):
    description: Optional[str] = None
    thing_id: Optional[int] = None
    category_id: Optional[int] = None
    open: Optional[bool] = None


# Manager class for CRUD operations
class TicketManager:
    @staticmethod
    def create(ticket: Ticket) -> int:
        """
        Create a new ticket.
        Pseudocode:
        1. Connect to database via util
        2. Insert ticket (thing_id, category_id, description, open)
        3. Return new ticket ID
        4. Handle foreign key constraints
        """
        with get_db_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute(
                    "INSERT INTO tickets (thing_id, category_id, description, open) VALUES (?, ?, ?, ?)",
                    (
                        ticket.thing_id,
                        ticket.category_id,
                        ticket.description,
                        ticket.open,
                    ),
                )
                if not cursor.lastrowid:
                    raise ValueError("Failed to create ticket")
                return cursor.lastrowid
            except sqlite3.IntegrityError as e:
                if "FOREIGN KEY constraint failed" in str(e):
                    raise ValueError(
                        f"Invalid thing_id: {ticket.thing_id} or category_id: {ticket.category_id}"
                    )
                raise e

    @staticmethod
    def update(ticket: Ticket) -> None:
        """
        Update an existing ticket.
        Pseudocode:
        1. Connect to database via util
        2. Update thing_id, category_id, description, open, updated_at, completed_at
        3. Set updated_at to current timestamp
        4. Handle missing ID or constraints
        """
        if ticket.id is None:
            raise ValueError("Ticket ID is required for update")
        with get_db_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute(
                    "UPDATE tickets SET thing_id = ?, category_id = ?, description = ?, open = ?, updated_at = CURRENT_TIMESTAMP, completed_at = ? WHERE id = ?",
                    (
                        ticket.thing_id,
                        ticket.category_id,
                        ticket.description,
                        ticket.open,
                        ticket.completed_at,
                        ticket.id,
                    ),
                )
                if cursor.rowcount == 0:
                    raise ValueError(
                        f"Ticket with ID {ticket.id} not found"
                    )
            except sqlite3.IntegrityError as e:
                if "FOREIGN KEY constraint failed" in str(e):
                    raise ValueError(
                        f"Invalid thing_id: {ticket.thing_id} or category_id: {ticket.category_id}"
                    )
                raise e

    @staticmethod
    def get_by_id(ticket_id: int) -> Optional[Ticket]:
        """
        Get a ticket by ID.
        Pseudocode:
        1. Connect to database via util
        2. Select ticket by ID
        3. Return Ticket model or None if not found
        """
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, thing_id, category_id, description, created_at, open, updated_at, completed_at FROM tickets WHERE id = ?",
                (ticket_id,),
            )
            row = cursor.fetchone()
            return Ticket(**row) if row else None

    @staticmethod
    def list(
        filters: Optional[TicketFilter] = None,
    ) -> List[Ticket]:
        """
        List tickets with mandatory fuzzy search on description and optional filters.
        Pseudocode:
        1. Connect to database via util
        2. Build query with mandatory description LIKE clause
        3. Add thing_id, category_id, open filters if provided
        4. Execute query and return list of Ticket models
        """
        query = "SELECT id, thing_id, category_id, description, created_at, open, updated_at, completed_at FROM tickets WHERE description LIKE ?"
        params = [
            f"%{filters.description if filters and filters.description else ''}%"
        ]

        if filters:
            if filters.thing_id is not None:
                query += " AND thing_id = ?"
                params.append(str(filters.thing_id))
            if filters.category_id is not None:
                query += " AND category_id = ?"
                params.append(str(filters.category_id))
            if filters.open is not None:
                query += " AND open = ?"
                params.append(str(filters.open).upper())

        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [Ticket(**row) for row in rows]

    @staticmethod
    def delete(ticket_id: int) -> None:
        """
        Delete a ticket by ID.
        Pseudocode:
        1. Connect to database via util
        2. Delete ticket by ID
        3. Handle missing ID or foreign key constraints
        """
        with get_db_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute(
                    "DELETE FROM tickets WHERE id = ?", (ticket_id,)
                )
                if cursor.rowcount == 0:
                    raise ValueError(
                        f"Ticket with ID {ticket_id} not found"
                    )
            except sqlite3.IntegrityError:
                raise ValueError(
                    f"Cannot delete ticket ID {ticket_id}: it is referenced by other records"
                )
