from fastapi import APIRouter, HTTPException, Query, status
from ..db import Controller


TicketLinkType = Controller.Tables.TicketLinkType
CategoryParams = Controller.Params.Category
ReadCategories = Controller.Responses.ReadCategories


router = APIRouter(prefix="/ticket_link_types", tags=["ticket_link_types"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_category(ticket_link_type: TicketLinkType):
    """
    Create a new ticket link type.
    Returns the ID of the created category.
    """
    try:
        category_id = ticket_link_type.create()
        return {"id": category_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{type_id}")
async def update_category(type_id: int, ticket_link_type: TicketLinkType):
    """
    Update a ticket link type by ID.
    """
    ticket_link_type.id = type_id
    try:
        TicketLinkType.update(ticket_link_type)
        return {"message": "TicketLinkType updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{type_id}", response_model=TicketLinkType)
async def get_category(type_id: int):
    """
    Get an ticket link type by ID.
    """
    ticket_link_type = TicketLinkType.get_by_id(type_id)
    if not ticket_link_type:
        raise HTTPException(
            status_code=404, detail="TicketLinkType not found"
        )
    return ticket_link_type


@router.get("/", response_model=ReadCategories)
async def list_categories(filters: CategoryParams = Query()):
    """
    List ticket link types with optional filters (fuzzy search on name).
    """
    return TicketLinkType.read(filters)


@router.delete("/{type_id}")
async def delete_category(type_id: int):
    """
    Delete an ticket link type by ID.
    """
    try:
        TicketLinkType.delete(type_id)
        return {"message": "TicketLinkType deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
