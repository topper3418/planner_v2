from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from ..db import controller as db


router = APIRouter(prefix="/things", tags=["things"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_thing(thing: db.Thing):
    """
    Create a new thing.
    Returns the ID of the created thing.
    """
    try:
        thing_id = db.ThingManager.create(thing)
        return {"id": thing_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{thing_id}")
async def update_thing(thing_id: int, thing: db.Thing):
    """
    Update a thing by ID.
    """
    thing.id = thing_id
    try:
        db.ThingManager.update(thing)
        return {"message": "Thing updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{thing_id}", response_model=db.Thing)
async def get_thing(thing_id: int):
    """
    Get a thing by ID.
    """
    thing = db.ThingManager.get_by_id(thing_id)
    if not thing:
        raise HTTPException(status_code=404, detail="Thing not found")
    return thing


@router.get("/", response_model=list[db.Thing])
async def list_things(filters: db.ThingFilter = Query()):
    """
    List things with optional filters (fuzzy search on name).
    """
    return db.ThingManager.list_things(filters)


@router.delete("/{thing_id}")
async def delete_thing(thing_id: int):
    """
    Delete a thing by ID.
    """
    try:
        db.ThingManager.delete(thing_id)
        return {"message": "Thing deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
