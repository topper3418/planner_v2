from fastapi import APIRouter, HTTPException, Query, status
from ..db import Controller

Comment = Controller.Tables.Comment
CommentParams = Controller.Params.Comment
ReadComments = Controller.Responses.ReadComments


router = APIRouter(prefix="/comments", tags=["comments"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_comment(comment: Comment):
    """
    Create a new comment.
    Returns the ID of the created comment.
    """
    try:
        comment_id = comment.create()
        return {"id": comment_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{comment_id}")
async def update_comment(comment_id: int, comment: Comment):
    """
    Update a comment by ID.
    """
    comment.id = comment_id
    try:
        Comment.update(comment)
        return {"message": "Comment updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{comment_id}", response_model=Comment)
async def get_comment(comment_id: int):
    """
    Get a comment by ID.
    """
    comment = Comment.get_by_id(comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment


@router.get("/", response_model=ReadComments)
async def list_comments(filters: CommentParams = Query()):
    """
    List comments with optional filters (fuzzy search on content).
    """
    return Comment.read(filters)


@router.delete("/{comment_id}")
async def delete_comment(comment_id: int):
    """
    Delete a comment by ID.
    """
    try:
        Comment.delete(comment_id)
        return {"message": "Comment deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
