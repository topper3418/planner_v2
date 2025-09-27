from pydantic import BaseModel, Field
from typing import TYPE_CHECKING, Literal, Optional, List
from datetime import datetime

from ..core import DbCore, ExceptionPackage

if TYPE_CHECKING:
    from .things import Thing
    from .ticket_categories import TicketCategory
    from .tickets import Ticket


# Pydantic model for Ticket
class Ticket(BaseModel):
    id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    open: Optional[bool] = True

    thing_id: Optional[int] = None
    category_id: Optional[int] = None
    parent_id: Optional[int] = None

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    thing: Optional["Thing"] = None
    category: Optional["TicketCategory"] = None
    parent: Optional["Ticket"] = None
    children: Optional[List["Ticket"]] = None

    class Config:
        from_attributes = True

    @classmethod
    def from_row(cls, row) -> "Ticket":
        ticket = cls(
            id=row["id"],
            title=row["title"],
            description=row["description"],
            open=row["open"],
            thing_id=row["thing_id"],
            category_id=row["category_id"],
            parent_id=row["parent_id"],
            created_at=row["created_at"],
            updated_at=row["updated_at"],
            completed_at=row["completed_at"],
        )
        if "thing_name" in row.keys():
            from .things import Thing

            ticket.thing = Thing(
                id=row["thing_id"],
                name=row.get("thing_name", None),
                description=row.get("thing_description", None),
                docs_link=row.get("thing_docs_link", None),
                parent_id=row.get("thing_parent_id", None),
                category_id=row.get("thing_category_id", None),
            )
        if "category_name" in row.keys():
            from .ticket_categories import TicketCategory

            ticket.category = TicketCategory(
                id=row["category_id"],
                name=row.get("category_name", None),
                description=row.get("category_description", None),
            )
        return ticket

    def populate_children(self) -> None:
        if self.id is None:
            self.children = []
            return
        query = "SELECT id, thing_id, category_id, description, created_at, open, updated_at, completed_at FROM tickets WHERE parent_id = ?"
        self.children = DbCore.run_list(query, (self.id,), Ticket)


# Pydantic model for Ticket filter
class TicketParams(BaseModel):
    thing_id: Optional[int] = None
    category_id: Optional[int] = None
    open: Optional[bool] = None
    search: Optional[str] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None
    updated_after: Optional[datetime] = None
    updated_before: Optional[datetime] = None
    completed_after: Optional[datetime] = None
    completed_before: Optional[datetime] = None
    include: list[Literal["thing", "category", "parent", "children"]] = []
    page_number: Optional[int] = Field(1, ge=1)
    page_size: Optional[int] = Field(10, ge=1, le=100)


# Manager class for CRUD operations
class TicketManager:
    @staticmethod
    def create(ticket: Ticket) -> int:
        query = (
            "INSERT INTO tickets"
            " (title, thing_id, category_id, description, open)"
            " VALUES (?, ?, ?, ?, ?)"
        )
        params = (
            ticket.title,
            ticket.thing_id,
            ticket.category_id,
            ticket.description,
            ticket.open,
        )
        exception_package = ExceptionPackage(
            foreign_key_constraint_error=f"Invalid thing_id: {ticket.thing_id} or category_id: {ticket.category_id}"
        )
        last_row_id = DbCore.run_create(query, params, exception_package)
        ticket.id = last_row_id
        return last_row_id

    @staticmethod
    def update(ticket: Ticket) -> None:
        if ticket.id is None:
            raise ValueError("Ticket ID is required for update")
        query = (
            "UPDATE tickets SET"
            " title = ?,"
            " thing_id = ?,"
            " category_id = ?,"
            " description = ?,"
            " open = ?,"
            " updated_at = CURRENT_TIMESTAMP,"
            " completed_at = ?"
            " WHERE id = ?"
        )
        params = (
            ticket.title,
            ticket.thing_id,
            ticket.category_id,
            ticket.description,
            ticket.open,
            ticket.completed_at,
            ticket.id,
        )
        exception_package = ExceptionPackage(
            foreign_key_constraint_error=f"Invalid thing_id: {ticket.thing_id} or category_id: {ticket.category_id}",
            not_found_error=f"Ticket with ID {ticket.id} not found",
        )
        DbCore.run_update(query, params, exception_package)

    @staticmethod
    def get_by_id(ticket_id: int) -> Optional[Ticket]:
        query = (
            "SELECT"
            " t.id, t.thing_id, t.category_id, t.description, t.created_at, t.open, t.updated_at, t.completed_at,"
            " c.name AS category_name, c.description AS category_description,"
            " th.name AS thing_name, th.description AS thing_description, th.docs_link AS thing_docs_link, th.parent_id AS thing_parent_id, th.category_id AS thing_category_id,"
            " p.id AS parent_id, p.description AS parent_description, p.open AS parent_open, p.created_at AS parent_created_at, p.updated_at AS parent_updated_at, p.completed_at AS parent_completed_at"
            " FROM tickets t"
            " JOIN ticket_categories c ON t.category_id = c.id"
            " JOIN things th ON t.thing_id = th.id"
            " JOIN tickets p ON t.parent_id = p.id"
            " WHERE id = ?"
        )
        ticket = DbCore.run_get_by_id(query, ticket_id, Ticket.from_row)
        if ticket:
            ticket.populate_children()
        return ticket

    @staticmethod
    def list_tickets(
        query_params: Optional[TicketParams] = None,
    ) -> List[Ticket]:
        select = "SELECT t.id, t.thing_id, t.category_id, t.description, t.created_at, t.open, t.updated_at, t.completed_at"
        from_clause = "FROM tickets t"
        where_seed = "WHERE 1=1"
        params = []
        if query_params and query_params.include:
            join_clauses = []
            if "thing" in query_params.include:
                select += ", th.name AS thing_name, th.description AS thing_description, th.docs_link AS thing_docs_link, th.parent_id AS thing_parent_id, th.category_id AS thing_category_id"
                join_clauses.append(
                    "LEFT JOIN things th ON t.thing_id = th.id"
                )
            if "category" in query_params.include:
                select += ", c.name AS category_name, c.description AS category_description"
                join_clauses.append(
                    "LEFT JOIN ticket_categories c ON t.category_id = c.id"
                )
            if "parent" in query_params.include:
                select += ", p.id AS parent_id, p.description AS parent_description, p.open AS parent_open, p.created_at AS parent_created_at, p.updated_at AS parent_updated_at, p.completed_at AS parent_completed_at"
                join_clauses.append(
                    "LEFT JOIN tickets p ON t.parent_id = p.id"
                )
            query = f"{select} {from_clause} {' '.join(join_clauses)} {where_seed}"
        else:
            query = f"{select} {from_clause} {where_seed}"

        if query_params:
            if query_params.thing_id is not None:
                query += " AND t.thing_id = ?"
                params.append(str(query_params.thing_id))
            if query_params.category_id is not None:
                query += " AND t.category_id = ?"
                params.append(str(query_params.category_id))
            if query_params.open is not None:
                query += " AND t.open = ?"
                params.append(str(query_params.open).upper())
            if query_params.search is not None:
                query += " AND (t.description LIKE ? OR t.title LIKE ?)"
                search_param = f"%{query_params.search}%"
                params.extend([search_param, search_param])
            if query_params.created_after is not None:
                query += " AND t.created_at >= ?"
                params.append(query_params.created_after.isoformat())
            if query_params.created_before is not None:
                query += " AND t.created_at <= ?"
                params.append(query_params.created_before.isoformat())
            if query_params.updated_after is not None:
                query += " AND t.updated_at >= ?"
                params.append(query_params.updated_after.isoformat())
            if query_params.updated_before is not None:
                query += " AND t.updated_at <= ?"
                params.append(query_params.updated_before.isoformat())
            if query_params.completed_after is not None:
                query += " AND t.completed_at >= ?"
                params.append(query_params.completed_after.isoformat())
            if query_params.completed_before is not None:
                query += " AND t.completed_at <= ?"
                params.append(query_params.completed_before.isoformat())
            if query_params.page_number and query_params.page_size:
                offset = (
                    query_params.page_number - 1
                ) * query_params.page_size
                query += " LIMIT ? OFFSET ?"
                params.extend([str(query_params.page_size), str(offset)])
        tickets = DbCore.run_list(query, tuple(params), Ticket.from_row)
        if query_params and "children" in query_params.include:
            for ticket in tickets:
                ticket.populate_children()
        return tickets

    @staticmethod
    def delete(ticket_id: int) -> None:
        query = "DELETE FROM tickets WHERE id = ?"
        exception_package = ExceptionPackage(
            not_found_error=f"Ticket with ID {ticket_id} not found"
        )
        return DbCore.run_delete(query, ticket_id, exception_package)
