from fastapi import APIRouter, HTTPException, Query, status
from ..db import controller as db


router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_ticket(ticket: db.Ticket):
    """
    Create a new ticket.
    Returns the ID of the created ticket.
    """
    try:
        ticket_id = db.TicketManager.create(ticket)
        return {"id": ticket_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{ticket_id}")
async def update_ticket(ticket_id: int, ticket: db.Ticket):
    """
    Update a ticket by ID.
    """
    ticket.id = ticket_id
    try:
        db.TicketManager.update(ticket)
        return {"message": "Ticket updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{ticket_id}", response_model=db.Ticket)
async def get_ticket(ticket_id: int):
    """
    Get a ticket by ID.
    """
    ticket = db.TicketManager.get_by_id(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.get("/", response_model=list[db.Ticket])
async def list_tickets(filters: db.TicketFilter = Query()):
    """
    List tickets with optional filters (fuzzy search on description).
    """
    return db.TicketManager.list(filters)


@router.delete("/{ticket_id}")
async def delete_ticket(ticket_id: int):
    """
    Delete a ticket by ID.
    """
    try:
        db.TicketManager.delete(ticket_id)
        return {"message": "Ticket deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
