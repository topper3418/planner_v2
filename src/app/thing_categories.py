from fastapi import APIRouter, HTTPException, Query, status
from ..db import Controller


ThingCategory = Controller.Tables.ThingCategory
CategoryParams = Controller.Params.Category
ReadCategories = Controller.Responses.ReadCategories


router = APIRouter(prefix="/categories", tags=["thing_categories"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_category(category: ThingCategory):
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
async def update_category(category_id: int, category: ThingCategory):
    """
    Update a category by ID.
    """
    category.id = category_id
    try:
        ThingCategory.update(category)
        return {"message": "ThingCategory updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{category_id}", response_model=ThingCategory)
async def get_category(category_id: int):
    """
    Get a category by ID.
    """
    category = ThingCategory.get_by_id(category_id)
    if not category:
        raise HTTPException(
            status_code=404, detail="ThingCategory not found"
        )
    return category


@router.get("/", response_model=ReadCategories)
async def list_categories(filters: CategoryParams = Query()):
    """
    List categories with optional filters (fuzzy search on name).
    """
    return ThingCategory.read(filters)


@router.delete("/{category_id}")
async def delete_category(category_id: int):
    """
    Delete a category by ID.
    """
    try:
        ThingCategory.delete(category_id)
        return {"message": "ThingCategory deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
