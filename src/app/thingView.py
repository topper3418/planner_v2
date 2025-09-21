from fastapi import APIRouter, Query
from ..db import views


router = APIRouter(prefix="/thingView", tags=["thingView"])


@router.get("/", response_model=list[views.ThingView])
async def list_things(filters: views.ThingViewFilter = Query()):
    """
    List things with optional filters (fuzzy search on name).
    """
    return views.ThingViewManager.list(filters)
