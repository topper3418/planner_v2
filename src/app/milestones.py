from fastapi import APIRouter, HTTPException, Query, status
from ..db import Controller

Milestone = Controller.Tables.Milestone
MilestoneParams = Controller.Params.Milestone
ReadMilestones = Controller.Responses.ReadMilestones


router = APIRouter(prefix="/milestones", tags=["milestones"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_milestone(milestone: Milestone):
    """
    Create a new milestone.
    Returns the ID of the created milestone.
    """
    try:
        milestone_id = milestone.create()
        return {"id": milestone_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{milestone_id}")
async def update_milestone(milestone_id: int, milestone: Milestone):
    """
    Update a milestone by ID.
    """
    milestone.id = milestone_id
    try:
        Milestone.update(milestone)
        return {"message": "Milestone updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{milestone_id}", response_model=Milestone)
async def get_milestone(milestone_id: int):
    """
    Get a milestone by ID.
    """
    milestone = Milestone.get_by_id(milestone_id)
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    return milestone


@router.get("/", response_model=ReadMilestones)
async def list_milestones(filters: MilestoneParams = Query()):
    """
    List milestones with optional filters (fuzzy search on content).
    """
    return Milestone.read(filters)


@router.delete("/{milestone_id}")
async def delete_milesteone(milestone_id: int):
    """
    Delete a milestone by ID.
    """
    try:
        Milestone.delete(milestone_id)
        return {"message": "Milestone deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
