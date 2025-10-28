from fastapi import APIRouter, HTTPException, Query, status
from ..db import Controller


ActionType = Controller.Tables.ActionType
CategoryParams = Controller.Params.Category
ReadCategories = Controller.Responses.ReadCategories


router = APIRouter(prefix="/types", tags=["action_types"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_category(action_type: ActionType):
    """
    Create a new action type.
    Returns the ID of the created category.
    """
    try:
        category_id = action_type.create()
        return {"id": category_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{type_id}")
async def update_category(type_id: int, action_type: ActionType):
    """
    Update a action type by ID.
    """
    action_type.id = type_id
    try:
        ActionType.update(action_type)
        return {"message": "ActionType updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{type_id}", response_model=ActionType)
async def get_category(type_id: int):
    """
    Get an action type by ID.
    """
    action_type = ActionType.get_by_id(type_id)
    if not action_type:
        raise HTTPException(status_code=404, detail="ActionType not found")
    return action_type


@router.get("/", response_model=ReadCategories)
async def list_categories(filters: CategoryParams = Query()):
    """
    List action types with optional filters (fuzzy search on name).
    """
    return ActionType.read(filters)


@router.delete("/{type_id}")
async def delete_category(type_id: int):
    """
    Delete an action type by ID.
    """
    try:
        ActionType.delete(type_id)
        return {"message": "ActionType deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
