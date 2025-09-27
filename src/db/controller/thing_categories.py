import logging
from .category_base import Category, CategoryManager


logger = logging.getLogger(__name__)


# Pydantic model for Category
class ThingCategory(Category):
    pass


# Manager class for CRUD operations
class ThingCategoryManager(CategoryManager):
    __table_name__ = "thing_categories"
    __category_model__ = ThingCategory
    logger = logger
