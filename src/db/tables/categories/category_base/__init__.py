import logging
from typing import Optional, List

from pydantic import BaseModel

from ....core import DbCore, ExceptionPackage

from ...util import as_staticmethod, as_classmethod

from .base import Category
from .params import CategoryParams

from .create import create
from .update import update
from .get_by_id import get_by_id
from .read import read, ReadCategoriesResponse
from .delete import delete
from .get_by_name import get_by_name


setattr(Category, "create", create)
setattr(Category, "update", as_classmethod(update))
setattr(Category, "get_by_id", as_classmethod(get_by_id))
setattr(Category, "read", as_classmethod(read))
setattr(Category, "delete", as_classmethod(delete))
setattr(Category, "get_by_name", as_classmethod(get_by_name))
Category.__params_class__ = CategoryParams


__all__ = ["Category", "CategoryParams"]
