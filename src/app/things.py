from fastapi import APIRouter, HTTPException, Query, status
from ..db import controller as controller
from .thing_categories import router as categories_router


router = APIRouter(prefix="/things", tags=["things"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_thing(thing: controller.Thing):
    """
    Create a new thing.
    Returns the ID of the created thing.
    """
    try:
        thing_id = controller.ThingManager.create(thing)
        return {"id": thing_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{thing_id}")
async def update_thing(thing_id: int, thing: controller.Thing):
    """
    Update a thing by ID.
    """
    thing.id = thing_id
    try:
        controller.ThingManager.update(thing)
        return {"message": "Thing updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{thing_id}", response_model=controller.Thing)
async def get_thing(thing_id: int):
    """
    Get a thing by ID.
    """
    thing = controller.ThingManager.get_by_id(thing_id)
    if not thing:
        raise HTTPException(status_code=404, detail="Thing not found")
    return thing


@router.get("/", response_model=list[controller.Thing])
async def list_things(filters: controller.ThingParams = Query()):
    """
    List things with optional filters (fuzzy search on name).
    """
    return controller.ThingManager.list_things(filters)


@router.delete("/{thing_id}")
async def delete_thing(thing_id: int):
    """
    Delete a thing by ID.
    """
    try:
        controller.ThingManager.delete(thing_id)
        return {"message": "Thing deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


router.include_router(categories_router)
