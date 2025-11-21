from src.scheduler import Scheduler

if __name__ == "__main__":
    scheduler = Scheduler()
    scheduler.read()
    print("MATCHING SCHEDULES:")
    for schedule in scheduler.matching_schedules:
        print(f"- {schedule.name} (ID: {schedule.id})")

    print("MATCHING TICKETS TO REOPEN:")
    for ticket in scheduler.regen_tickets:
        print(f"- {ticket.title} (ID: {ticket.id})")

    scheduler.reopen_scheduled_tickets()
