from typing import Optional
from fastapi import APIRouter, HTTPException, status
from ..db import controller as db


router = APIRouter(prefix="/thingView", tags=["thingView"])


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
async def list_things(filters: Optional[db.ThingFilter] = None):
    """
    List things with optional filters (fuzzy search on name).
    """
    return db.ThingManager.list_things(filters)
