from ..util import as_staticmethod

from .base import Comment
from .params import CommentParams
from .create import create
from .update import update
from .get_by_id import get_by_id
from .read import read, ReadCommentsResponse
from .delete import delete


setattr(Comment, "create", create)
setattr(Comment, "get_by_id", as_staticmethod(get_by_id))
setattr(Comment, "read", as_staticmethod(read))
setattr(Comment, "update", update)
setattr(Comment, "delete", as_staticmethod(delete))
Comment.__params_class__ = CommentParams
Comment.__table_name__ = "comments"


__all__ = ["Comment", "CommentParams"]
