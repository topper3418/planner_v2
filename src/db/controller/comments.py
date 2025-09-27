import logging
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

from ..core import DbCore, ExceptionPackage


logger = logging.getLogger(__name__)


# Pydantic model for Comment
class Comment(BaseModel):
    id: Optional[int] = None
    ticket_id: Optional[int] = None
    content: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Pydantic model for Comment filter
class CommentFilter(BaseModel):
    content: Optional[str] = None
    ticket_id: Optional[int] = None
    page_number: Optional[int] = Field(1, ge=1)
    page_size: Optional[int] = Field(10, ge=1, le=100)


# Manager class for CRUD operations
class CommentManager:
    @staticmethod
    def create(comment: Comment) -> int:
        logger.info(f"Creating new Comment: {comment}")
        query = "INSERT INTO comments (ticket_id, content) VALUES (?, ?)"
        params = (comment.ticket_id, comment.content)
        exception_package = ExceptionPackage(
            foreign_key_constraint_error=f"Invalid ticket_id: {comment.ticket_id}"
        )
        last_row_id = DbCore.run_create(query, params, exception_package)
        comment.id = last_row_id
        return last_row_id

    @staticmethod
    def update(comment: Comment) -> None:
        logger.info(f"Updating Comment: {comment}")
        if comment.id is None:
            raise ValueError("Comment ID is required for update")
        query = "UPDATE comments SET content = ? WHERE id = ?"
        params = (comment.content, comment.id)
        exception_package = ExceptionPackage(
            not_found_error=f"Comment with ID {comment.id} not found"
        )
        DbCore.run_update(query, params, exception_package)

    @staticmethod
    def get_by_id(comment_id: int) -> Optional[Comment]:
        logger.info(f"Getting Comment by ID: {comment_id}")
        query = "SELECT id, ticket_id, content, created_at FROM comments WHERE id = ?"
        return DbCore.run_get_by_id(query, comment_id, Comment)

    @staticmethod
    def list_comments(
        filters: Optional[CommentFilter] = None,
    ) -> List[Comment]:
        logger.info(f"Listing Comments with filters: {filters}")
        query = "SELECT id, ticket_id, content, created_at FROM comments WHERE content LIKE ?"
        params = [
            f"%{filters.content if filters and filters.content else ''}%"
        ]

        if filters:
            if filters.ticket_id is not None:
                query += " AND ticket_id = ?"
                params.append(str(filters.ticket_id))
            if (
                filters.page_number is not None
                and filters.page_size is not None
            ):
                offset = (filters.page_number - 1) * filters.page_size
                query += " LIMIT ? OFFSET ?"
                params.append(str(filters.page_size))
                params.append(str(offset))
        return DbCore.run_list(query, tuple(params), Comment)

    @staticmethod
    def delete(comment_id: int) -> None:
        logger.info(f"Deleting Comment with ID: {comment_id}")
        query = "DELETE FROM comments WHERE id = ?"
        exception_package = ExceptionPackage(
            not_found_error=f"Comment with ID {comment_id} not found"
        )
        DbCore.run_delete(query, comment_id, exception_package)
