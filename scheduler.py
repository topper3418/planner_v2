import time
from datetime import datetime

from src.scheduler.run import run_scheduled_ticket_reopening


def match_and_reopen_tickets():
    result = run_scheduled_ticket_reopening()
    print("MATCHING SCHEDULES:")
    for schedule in result["matching_schedules"]:
        print(f"- {schedule['name']} (ID: {schedule['id']})")

    print("MATCHING TICKETS TO REOPEN:")
    for ticket in result["tickets"]:
        print(f"- {ticket['title']} (ID: {ticket['id']})")

    return result


if __name__ == "__main__":
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
