import sqlite3
from pydantic import BaseModel
from typing import Optional, List
from ..core import DbCore, ExceptionPackage


# Pydantic model for Category
class Category(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


# Pydantic model for Category filter
class CategoryFilter(BaseModel):
    name: Optional[str] = None
    search: Optional[str] = None


# Manager class for CRUD operations
class CategoryManager:
    __table_name__ = "categories"
    __category_model__ = Category

    @classmethod
    def create(cls, category: Category) -> int:
        query = f"INSERT INTO {cls.__table_name__} (name, description) VALUES (?, ?)"
        params = (category.name, category.description)
        exception_package = ExceptionPackage(
            unique_constraint_error=f"{cls.__category_model__.__name__} name '{category.name}' already exists"
        )
        last_row_id = DbCore.run_create(query, params, exception_package)
        category.id = last_row_id
        return last_row_id

    @classmethod
    def update(cls, category: Category) -> None:
        if category.id is None:
            raise ValueError(
                f"{cls.__category_model__.__name__} ID is required for update"
            )
        query = f"UPDATE {cls.__table_name__} SET name = ?, description = ? WHERE id = ?"
        params = (category.name, category.description, category.id)
        exception_package = ExceptionPackage(
            unique_constraint_error=f"{cls.__category_model__.__name__} name '{category.name}' already exists",
            not_found_error=f"{cls.__category_model__.__name__} with ID {category.id} not found",
        )
        DbCore.run_update(query, params, exception_package)

    @classmethod
    def get_by_id(cls, category_id: int) -> Optional[Category]:
        query = f"SELECT * FROM {cls.__table_name__} WHERE id = ?"
        return DbCore.run_get_by_id(query, category_id, Category)

    @classmethod
    def list_categories(
        cls,
        filters: Optional[CategoryFilter] = None,
    ) -> List[Category]:
        query = f"SELECT c.* FROM {cls.__table_name__} c WHERE name LIKE ?"
        params = [f"%{filters.name if filters and filters.name else ''}%"]

        if filters and filters.search is not None:
            query += " AND (c.name LIKE ? OR c.description LIKE ?)"
            search_param = f"%{filters.search}%"
            params.extend([search_param, search_param])

        return DbCore.run_list(query, tuple(params), Category)

    @classmethod
    def delete(cls, category_id: int) -> None:
        query = f"DELETE FROM {cls.__table_name__} WHERE id = ?"
        exception_package = ExceptionPackage(
            not_found_error=f"{cls.__category_model__.__name__} with ID {category_id} not found",
            foreign_key_constraint_error=f"Cannot delete {cls.__category_model__.__name__} ID {category_id}: it is referenced by other records",
        )
        DbCore.run_delete(query, category_id, exception_package)
