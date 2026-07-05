from datetime import date

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from ..db import Controller
from ..scheduler.run import run_scheduled_ticket_reopening

Schedule = Controller.Tables.Schedule
ScheduleParams = Controller.Params.Schedule
ReadSchedules = Controller.Responses.ReadSchedules


router = APIRouter(prefix="/schedules", tags=["schedules"])


class RunSchedulesResponse(BaseModel):
    matching_schedules: list[dict]
    tickets_processed: int
    tickets: list[dict]


@router.post("/run", response_model=RunSchedulesResponse)
async def run_schedules(date: date | None = Query(default=None)):
    """
    Manually run the scheduler for today (or an optional date override).
    Reopens tickets whose schedules match the target date.
    """
    try:
        return run_scheduled_ticket_reopening(date)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_schedule(schedule: Schedule):
    """
    Create a new schedule.
    Returns the ID of the created schedule.
    """
    try:
        schedule_id = schedule.create()
        return {"id": schedule_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{schedule_id}")
async def update_schedule(schedule_id: int, schedule: Schedule):
    """
    Update a schedule by ID.
    """
    schedule.id = schedule_id
    try:
        Schedule.update(schedule)
        return {"message": "Schedule updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{schedule_id}", response_model=Schedule)
async def get_schedule(schedule_id: int):
    """
    Get a schedule by ID.
    """
    schedule = Schedule.get_by_id(schedule_id)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule


@router.get("/", response_model=ReadSchedules)
async def list_schedules(filters: ScheduleParams = Query()):
    """
    List schedules with optional filters (fuzzy search on content).
    """
    return Schedule.read(filters)


@router.delete("/{schedule_id}")
async def delete_milesteone(schedule_id: int):
    """
    Delete a schedule by ID.
    """
    try:
        Schedule.delete(schedule_id)
        return {"message": "Schedule deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
