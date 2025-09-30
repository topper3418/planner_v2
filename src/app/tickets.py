from fastapi import APIRouter, HTTPException, Query, status
from ..db import Controller
from .ticket_categories import router as categories_router


Ticket = Controller.Tables.Ticket
TicketParams = Controller.Params.Ticket


router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_ticket(ticket: Ticket):
    """
    Create a new ticket.
    Returns the ID of the created ticket.
    """
    try:
        ticket_id = ticket.create()
        return {"id": ticket_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{ticket_id}")
async def update_ticket(ticket_id: int, ticket: Ticket):
    """
    Update a ticket by ID.
    """
    ticket.id = ticket_id
    try:
        Ticket.update(ticket)
        return {"message": "Ticket updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{ticket_id}", response_model=Ticket)
async def get_ticket(ticket_id: int):
    """
    Get a ticket by ID.
    """
    ticket = Ticket.get_by_id(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.get("/", response_model=list[Ticket])
async def list_tickets(filters: TicketParams = Query()):
    """
    List tickets with optional filters (fuzzy search on description).
    """
    return Ticket.read(filters)


@router.delete("/{ticket_id}")
async def delete_ticket(ticket_id: int):
    """
    Delete a ticket by ID.
    """
    try:
        Ticket.delete(ticket_id)
        return {"message": "Ticket deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


router.include_router(categories_router)
