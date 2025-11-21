from fastapi import APIRouter, HTTPException, Query, status
from ..db import Controller

User = Controller.Tables.User
UserParams = Controller.Params.User
ReadUsers = Controller.Responses.ReadUsers


router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(user: User):
    """
    Create a new user.
    Returns the ID of the created user.
    """
    try:
        print("Creating User:", user)
        user_id = user.create()
        return {"id": user_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{user_id}")
async def update_user(user_id: int, user: User):
    """
    Update a user by ID.
    """
    user.id = user_id
    try:
        User.update(user)
        return {"message": "User updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{user_id}", response_model=User)
async def get_user(user_id: int):
    """
    Get a user by ID.
    """
    user = User.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/", response_model=ReadUsers)
async def list_users(filters: UserParams = Query()):
    """
    List users with optional filters (fuzzy search on content).
    """
    return User.read(filters)


@router.delete("/{user_id}")
async def delete_milesteone(user_id: int):
    """
    Delete a user by ID.
    """
    try:
        User.delete(user_id)
        return {"message": "User deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
