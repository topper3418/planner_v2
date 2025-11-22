import time
from datetime import datetime

from src.scheduler import Scheduler


def match_and_reopen_tickets():
    scheduler = Scheduler()
    scheduler.read()
    print("MATCHING SCHEDULES:")
    for schedule in scheduler.matching_schedules:
        print(f"- {schedule.name} (ID: {schedule.id})")

    print("MATCHING TICKETS TO REOPEN:")
    for ticket in scheduler.regen_tickets:
        print(f"- {ticket.title} (ID: {ticket.id})")

    scheduler.reopen_scheduled_tickets()


while True:
    now = datetime.now()
    # if the hour is 3am (run the job)
    if now.hour == 3 and now.minute == 0:
        print(f"Running scheduled ticket reopening at {now}")
        match_and_reopen_tickets()
        # Sleep for 61 seconds to avoid running multiple times in the same minute
        time.sleep(61)
    else:
        # Sleep for 30 seconds before checking again
        time.sleep(30)
