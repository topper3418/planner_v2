from .category_base import Category, CategoryManager


# Pydantic model for Category
class ActionType(Category):
    pass


# Manager class for CRUD operations
class ActionTypeManager(CategoryManager):
    __table_name__ = "action_types"
    __category_model__ = ActionType
