from ..util import as_staticmethod

from .base import User
from .params import UserParams
from .create import create
from .update import update
from .get_by_id import get_by_id
from .read import read, ReadUsersResponse
from .delete import delete


setattr(User, "create", create)
setattr(User, "get_by_id", as_staticmethod(get_by_id))
setattr(User, "read", as_staticmethod(read))
setattr(User, "update", update)
setattr(User, "delete", as_staticmethod(delete))
setattr(User, "add_ticket", update)
setattr(User, "remove_ticket", update)
User.__params_class__ = UserParams
User.__table_name__ = "comments"


__all__ = ["User", "UserParams", "ReadUsersResponse"]
