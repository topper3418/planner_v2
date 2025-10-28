from functools import wraps
from typing import List, TypeVar
from pydantic import BaseModel

from .table_model import TableModel


def as_staticmethod(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)

    return staticmethod(wrapper)


def as_classmethod(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)

    return classmethod(wrapper)
