from fastapi import APIRouter, HTTPException, Query, status
from ..db import controller


router = APIRouter(prefix="/categories", tags=["categories"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_category(category: controller.Category):
    """
    Create a new category.
    Returns the ID of the created category.
    """
    try:
        category_id = controller.CategoryManager.create(category)
        return {"id": category_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{category_id}")
async def update_category(category_id: int, category: controller.Category):
    """
    Update a category by ID.
    """
    category.id = category_id
    try:
        controller.CategoryManager.update(category)
        return {"message": "Category updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{category_id}", response_model=controller.Category)
async def get_category(category_id: int):
    """
    Get a category by ID.
    """
    category = controller.CategoryManager.get_by_id(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.get("/", response_model=list[controller.Category])
async def list_categories(filters: controller.CategoryFilter = Query()):
    """
    List categories with optional filters (fuzzy search on name).
    """
    return controller.CategoryManager.list_categories(filters)


@router.delete("/{category_id}")
async def delete_category(category_id: int):
    """
    Delete a category by ID.
    """
    try:
        controller.CategoryManager.delete(category_id)
        return {"message": "Category deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
