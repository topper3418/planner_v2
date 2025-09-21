from fastapi import APIRouter, HTTPException, Query, status
from ..db import controller


router = APIRouter(prefix="/actions", tags=["actions"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_action(action: controller.Action):
    """
    Create a new action.
    Returns the ID of the created action.
    """
    try:
        action_id = controller.ActionManager.create(action)
        return {"id": action_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{action_id}")
async def update_action(action_id: int, action: controller.Action):
    """
    Update an action by ID.
    """
    action.id = action_id
    try:
        controller.ActionManager.update(action)
        return {"message": "Action updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{action_id}", response_model=controller.Action)
async def get_action(action_id: int):
    """
    Get an action by ID.
    """
    action = controller.ActionManager.get_by_id(action_id)
    if not action:
        raise HTTPException(status_code=404, detail="Action not found")
    return action


@router.get("/", response_model=list[controller.Action])
async def list_actions(filters: controller.ActionFilter = Query()):
    """
    List actions with optional filters (fuzzy search on action_type).
    """
    return controller.ActionManager.list_actions(filters)


@router.delete("/{action_id}")
async def delete_action(action_id: int):
    """
    Delete an action by ID.
    """
    try:
        controller.ActionManager.delete(action_id)
        return {"message": "Action deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
