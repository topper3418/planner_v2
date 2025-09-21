from fastapi import APIRouter, HTTPException, Query, status
from ..db import controller


router = APIRouter(prefix="/comments", tags=["comments"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_comment(comment: controller.Comment):
    """
    Create a new comment.
    Returns the ID of the created comment.
    """
    try:
        comment_id = controller.CommentManager.create(comment)
        return {"id": comment_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{comment_id}")
async def update_comment(comment_id: int, comment: controller.Comment):
    """
    Update a comment by ID.
    """
    comment.id = comment_id
    try:
        controller.CommentManager.update(comment)
        return {"message": "Comment updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{comment_id}", response_model=controller.Comment)
async def get_comment(comment_id: int):
    """
    Get a comment by ID.
    """
    comment = controller.CommentManager.get_by_id(comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment


@router.get("/", response_model=list[controller.Comment])
async def list_comments(filters: controller.CommentFilter = Query()):
    """
    List comments with optional filters (fuzzy search on content).
    """
    return controller.CommentManager.list_comments(filters)


@router.delete("/{comment_id}")
async def delete_comment(comment_id: int):
    """
    Delete a comment by ID.
    """
    try:
        controller.CommentManager.delete(comment_id)
        return {"message": "Comment deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
