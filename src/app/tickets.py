from datetime import date, datetime
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from src.scheduler.scheduler import Scheduler

from ..db import Controller
from .ticket_categories import router as categories_router


Ticket = Controller.Tables.Ticket
TicketParams = Controller.Params.Ticket
ReadTickets = Controller.Responses.ReadTickets
Milestone = Controller.Tables.Milestone
MilestoneParams = Controller.Params.Milestone
MilestonesResponse = Controller.Responses.ReadMilestones
TicketLink = Controller.Tables.TicketLink
TicketLinkParams = Controller.Params.TicketLink


router = APIRouter(prefix="/tickets", tags=["tickets"])
router.include_router(categories_router)


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


@router.get("/count")
async def count_tickets(filters: TicketParams = Query()):
    """
    Count tickets with optional filters
    """
    count = Ticket.get_count(filters)
    return {"count": count}


@router.put("/{ticket_id}")
async def update_ticket(ticket_id: int, ticket: Ticket):
    """
    Update a ticket by ID.
    """
    print("Updating ticket:", ticket)
    ticket.id = ticket_id
    try:
        Ticket.update(ticket)
        return {"message": "Ticket updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


class MutateMilestoneRequest(BaseModel):
    milestone_id: int


@router.post("/{ticket_id}/add_milestone", response_model=Milestone)
async def add_milestone_to_ticket(
    ticket_id: int, data: MutateMilestoneRequest
):
    """
    Add a milestone to a ticket.
    """
    try:
        milestone_id = data.milestone_id
        milestone = Milestone.get_by_id(milestone_id)  # type: ignore
        ticket = Ticket.get_by_id(ticket_id)
        ticket.add_milestone(milestone_id)  # type: ignore
        return milestone
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{ticket_id}/remove_milestone", response_model=Milestone)
async def remove_milestone_from_ticket(
    ticket_id: int, data: MutateMilestoneRequest
):
    """
    Remove a milestone from a ticket.
    """
    try:
        milestone_id = data.milestone_id
        milestone = Milestone.get_by_id(milestone_id)  # type: ignore
        ticket = Ticket.get_by_id(ticket_id)
        ticket.remove_milestone(milestone_id)  # type: ignore
        return milestone
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


@router.get("/", response_model=ReadTickets)
async def list_tickets(filters: TicketParams = Query()):
    """
    List tickets with optional filters
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


@router.get("/todos/{date_str}", response_model=ReadTickets)
async def get_todo_tickets(date_str: str):
    """
    Get tickets that are due on a specific date, by due date and schedules.
    """
    try:
        # get the date as a datetime object
        year, month, day = map(int, date_str.split("-"))
        date_in = datetime(year, month, day, 0, 0, 0)
        print("Fetching todo tickets for date:", date_in)
        # fetch tickets due that day
        ticket_params = TicketParams(
            due_date=date_str, include=["category"], page_size=1000
        )

        tickets_due = Ticket.read(ticket_params)
        # now get scheduled tickets
        scheduler = Scheduler(date_in)
        scheduler.read()
        scheduled_tickets_data = scheduler.regen_tickets
        # loop through scheduled tickets and add any that aren't already in tickets_due
        for ticket in scheduled_tickets_data:
            if ticket in tickets_due.data:
                continue
            # also dedupe for those with a completion action after the date_in
            if ticket.has_been_completed_since(date_in.date()):  # type: ignore
                continue
            ticket.populate_category()  # type: ignore
            tickets_due.data.append(ticket)
            tickets_due.count += 1
        # finally return the combined list
        return tickets_due
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{ticket_id}/links")
async def get_ticket_links(
    ticket_id: int, filters: TicketLinkParams = Query()
):
    """
    Get links for a specific ticket.
    """
    try:
        filters.ticket_id = ticket_id
        ticket_links = TicketLink.read(filters)
        return ticket_links
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{ticket_id}/links")
async def add_ticket_link(ticket_id: int, ticket_link: TicketLink):
    """
    Add a link to a specific ticket.
    """
    try:
        ticket_link.ticket_id = ticket_id
        link_id = ticket_link.create()
        return {"id": link_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{ticket_id}/links/{link_id}")
async def delete_ticket_link(ticket_id: int, link_id: int):
    """
    Delete a link from a specific ticket.
    """
    try:
        TicketLink.delete(link_id)
        return {"message": "Ticket link deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
