import logging
from fastapi import APIRouter, HTTPException, Query, status
from ..db import Controller
from .thing_categories import router as categories_router


Thing = Controller.Tables.Thing
ThingParams = Controller.Params.Thing
ReadThings = Controller.Responses.ReadThings


logger = logging.getLogger(__name__)


router = APIRouter(prefix="/things", tags=["things"])
router.include_router(categories_router)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_thing(thing: Thing):
    """
    Create a new thing.
    Returns the ID of the created thing.
    """
    logger.info(f"Creating Thing: {thing}")
    try:
        thing_id = thing.create()
        return {"id": thing_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/tree", response_model=ReadThings)
async def get_thing_tree():
    """
    Get the hierarchical tree of things.
    """
    logger.debug("Fetching thing tree")
    things = Thing.read(ThingParams(parent_id=0, page_size=1000))
    print("fetched things:", things)
    for thing in things.data:
        thing.populate_children(recursive=True, get_count=True)
    return things


@router.put("/{thing_id}")
async def update_thing(thing_id: int, thing: Thing):
    """
    Update a thing by ID.
    """
    logger.info(f"Updating Thing ID {thing_id} with data: {thing}")
    thing.id = thing_id
    print(f"Updating Thing: {thing}")
    try:
        thing.update()
        return {"message": "Thing updated", "thing": thing.model_dump()}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{thing_id}", response_model=Thing)
async def get_thing(thing_id: int):
    """
    Get a thing by ID.
    """
    logger.debug(f"Fetching Thing ID {thing_id}")
    thing = Thing.get_by_id(thing_id)
    if not thing:
        raise HTTPException(status_code=404, detail="Thing not found")
    return thing


@router.get("/", response_model=ReadThings)
async def list_things(filters: ThingParams = Query()):
    """
    List things with optional filters (fuzzy search on name).
    """
    logger.debug(f"Listing Things with filters: {filters}")
    return Thing.read(filters)


@router.delete("/{thing_id}")
async def delete_thing(thing_id: int):
    """
    Delete a thing by ID.
    """
    logger.info(f"Deleting Thing ID {thing_id}")
    try:
        Thing.delete(thing_id)
        return {"message": "Thing deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
