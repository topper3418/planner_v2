from pydantic import BaseModel
from typing import TYPE_CHECKING, Literal, Optional, List
from datetime import datetime

from ..core import DbCore, ExceptionPackage


if TYPE_CHECKING:
    from .tickets import Ticket
    from .action_types import ActionType


# Pydantic model for Action
class Action(BaseModel):
    id: Optional[int] = None
    ticket_id: Optional[int] = None
    action_text: Optional[str] = None
    action_type_id: Optional[int] = None
    performed_at: Optional[datetime] = None
    ticket: Optional["Ticket"] = None
    action_type: Optional["ActionType"] = None

    class Config:
        from_attributes = True

    def from_row(self, row) -> "Action":
        action = Action(
            id=row["id"],
            ticket_id=row["ticket_id"],
            action_type=row["action_type"],
            performed_at=row["performed_at"],
        )
        if "ticket_title" in row.keys():
            from .tickets import Ticket

            action.ticket = Ticket(
                id=row["ticket_id"],
                title=row.get("ticket_title", None),
                description=row.get("ticket_description", None),
                open=row.get("ticket_open", None),
                thing_id=row.get("ticket_thing_id", None),
                category_id=row.get("ticket_category_id", None),
                parent_id=row.get("ticket_parent_id", None),
                created_at=row.get("ticket_created_at", None),
                updated_at=row.get("ticket_updated_at", None),
                completed_at=row.get("ticket_completed_at", None),
            )
        if "action_type_name" in row.keys():
            from .action_types import ActionType

            action.action_type = ActionType(
                id=row["action_type_id"],
                name=row.get("action_type_name", None),
                description=row.get("action_type_description", None),
            )
        return action


# Pydantic model for Action filter
class ActionParams(BaseModel):
    action_type: Optional[str] = None
    ticket_id: Optional[int] = None
    include: list[Literal["ticket", "action_type"]] = []
    page_number: Optional[int] = Field(1, ge=1)
    page_size: Optional[int] = Field(10, ge=1, le=100)


# Manager class for CRUD operations
class ActionManager:
    @staticmethod
    def create(action: Action) -> int:
        query = "INSERT INTO actions (action_text, ticket_id, action_type_id) VALUES (?, ?, ?)"
        params = (
            action.action_text,
            action.ticket_id,
            action.action_type_id,
        )
        exception_package = ExceptionPackage(
            foreign_key_constraint_error=f"Invalid ticket_id: {action.ticket_id}"
        )
        last_row_id = DbCore.run_create(query, params, exception_package)
        action.id = last_row_id
        return last_row_id

    @staticmethod
    def update(action: Action) -> None:
        if action.id is None:
            raise ValueError("Action ID is required for update")
        query = "UPDATE actions SET ticket_id = ?, action_type_id = ? WHERE id = ?"
        params = (action.ticket_id, action.action_type_id, action.id)
        exception_package = ExceptionPackage(
            foreign_key_constraint_error=f"Invalid ticket_id: {action.ticket_id}",
            not_found_error=f"Action with ID {action.id} not found",
        )
        DbCore.run_update(query, params, exception_package)

    @staticmethod
    def get_by_id(action_id: int) -> Optional[Action]:
        query = (
            "SELECT"
            " a.id, a.ticket_id, a.action_type_id, a.performed_at,"
            " t.title AS ticket_title, t.description AS ticket_description, t.thing_id AS ticket_thing_id, t.category_id AS ticket_category_id, t.parent_id AS ticket_parent_id, t.created_at AS ticket_created_at, t.open AS ticket_open, t.updated_at AS ticket_updated_at, t.completed_at AS ticket_completed_at"
            " at.name AS action_type_name, at.description AS action_type_description"
            " FROM actions a"
            " LEFT JOIN tickets t ON a.ticket_id = t.id"
            " LEFT JOIN action_types at ON a.action_type = at.id"
            " WHERE id = ?"
        )
        return DbCore.run_get_by_id(query, action_id, Action.from_row)

    @staticmethod
    def list_actions(
        filters: Optional[ActionParams] = None,
    ) -> List[Action]:
        select_clause = (
            "SELECT"
            " a.id, a.action_text, a.ticket_id, a.action_type_id, a.performed_at"
        )
        from_clause = " FROM actions a"
        where_clause = " WHERE 1 = 1"
        params = []

        if filters and filters.include:
            joins = []
            if "ticket" in filters.include:
                select_clause += (
                    ", t.title AS ticket_title"
                    ", t.description AS ticket_description"
                    ", t.thing_id AS ticket_thing_id"
                    ", t.category_id AS ticket_category_id"
                    ", t.parent_id AS ticket_parent_id"
                    ", t.created_at AS ticket_created_at"
                    ", t.open AS ticket_open"
                    ", t.updated_at AS ticket_updated_at"
                    ", t.completed_at AS ticket_completed_at"
                )
                joins.append(" LEFT JOIN tickets t ON a.ticket_id = t.id")
            if "action_type" in filters.include:
                select_clause += (
                    ", at.name AS action_type_name"
                    ", at.description AS action_type_description"
                )
                joins.append(
                    " LEFT JOIN action_types at ON a.action_type = at.id"
                )
            query = (
                select_clause + from_clause + "".join(joins) + where_clause
            )
        else:
            query = select_clause + from_clause + where_clause

        if filters:
            if filters.action_type is not None:
                query += " AND a.action_type = ?"
                params.append(filters.action_type)
            if filters.ticket_id is not None:
                query += " AND a.ticket_id = ?"
                params.append(str(filters.ticket_id))
            if (
                filters.page_number is not None
                and filters.page_size is not None
            ):
                offset = (filters.page_number - 1) * filters.page_size
                query += " LIMIT ? OFFSET ?"
                params.append(str(filters.page_size))
                params.append(str(offset))

        return DbCore.run_list(query, tuple(params), Action.from_row)

    @staticmethod
    def delete(action_id: int) -> None:
        query = "DELETE FROM actions WHERE id = ?"
        exception_package = ExceptionPackage(
            not_found_error=f"Action with ID {action_id} not found"
        )
        DbCore.run_delete(query, action_id, exception_package)
