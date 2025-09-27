from fastapi import APIRouter, HTTPException, Query, status
from ..db import controller
from .ticket_categories import router as categories_router


router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_ticket(ticket: controller.Ticket):
    """
    Create a new ticket.
    Returns the ID of the created ticket.
    """
    try:
        ticket_id = controller.TicketManager.create(ticket)
        return {"id": ticket_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{ticket_id}")
async def update_ticket(ticket_id: int, ticket: controller.Ticket):
    """
    Update a ticket by ID.
    """
    ticket.id = ticket_id
    try:
        controller.TicketManager.update(ticket)
        return {"message": "Ticket updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{ticket_id}", response_model=controller.Ticket)
async def get_ticket(ticket_id: int):
    """
    Get a ticket by ID.
    """
    ticket = controller.TicketManager.get_by_id(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.get("/", response_model=list[controller.Ticket])
async def list_tickets(filters: controller.TicketParams = Query()):
    """
    List tickets with optional filters (fuzzy search on description).
    """
    return controller.TicketManager.list_tickets(filters)


@router.delete("/{ticket_id}")
async def delete_ticket(ticket_id: int):
    """
    Delete a ticket by ID.
    """
    try:
        controller.TicketManager.delete(ticket_id)
        return {"message": "Ticket deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


router.include_router(categories_router)
