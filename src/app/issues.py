from typing import Optional
from fastapi import APIRouter, HTTPException, status
from ..db import controller as db


router = APIRouter(prefix="/categories", tags=["categories"])


# Issues Routes
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_issue(issue: db.Issue):
    """
    Create a new issue.
    Returns the ID of the created issue.
    """
    try:
        issue_id = db.IssueManager.create(issue)
        return {"id": issue_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{issue_id}")
async def update_issue(issue_id: int, issue: db.Issue):
    """
    Update an issue by ID.
    """
    issue.id = issue_id
    try:
        db.IssueManager.update(issue)
        return {"message": "Issue updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{issue_id}", response_model=db.Issue)
async def get_issue(issue_id: int):
    """
    Get an issue by ID.
    """
    issue = db.IssueManager.get_by_id(issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue


@router.get("/", response_model=list[db.Issue])
async def list_issues(filters: Optional[db.IssueFilter] = None):
    """
    List issues with optional filters (fuzzy search on title).
    """
    return db.IssueManager.list_issues(filters)


@router.delete("/{issue_id}")
async def delete_issue(issue_id: int):
    """
    Delete an issue by ID.
    """
    try:
        db.IssueManager.delete(issue_id)
        return {"message": "Issue deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
