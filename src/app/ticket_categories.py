from fastapi import APIRouter, HTTPException, Query, status
from ..db import Controller


TicketCategory = Controller.Tables.TicketCategory
CategoryParams = Controller.Params.Category


router = APIRouter(prefix="/categories", tags=["ticket_categories"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_category(category: TicketCategory):
    """
    Create a new category.
    Returns the ID of the created category.
    """
    try:
        category_id = category.create()
        return {"id": category_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{category_id}")
async def update_category(category_id: int, category: TicketCategory):
    """
    Update a category by ID.
    """
    category.id = category_id
    try:
        TicketCategory.update(category)
        return {"message": "TicketCategory updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{category_id}", response_model=TicketCategory)
async def get_category(category_id: int):
    """
    Get a category by ID.
    """
    category = TicketCategory.get_by_id(category_id)
    if not category:
        raise HTTPException(
            status_code=404, detail="TicketCategory not found"
        )
    return category


@router.get("/", response_model=list[TicketCategory])
async def list_categories(filters: CategoryParams = Query()):
    """
    List categories with optional filters (fuzzy search on name).
    """
    return TicketCategory.read(filters)


@router.delete("/{category_id}")
async def delete_category(category_id: int):
    """
    Delete a category by ID.
    """
    try:
        TicketCategory.delete(category_id)
        return {"message": "TicketCategory deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
