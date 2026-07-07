from datetime import date
from pathlib import Path

SCHEDULER_STAMP_PATH = Path("data/.scheduler_last_run")


def scheduler_ran_for(date_value: date) -> bool:
    if not SCHEDULER_STAMP_PATH.exists():
        return False
    return SCHEDULER_STAMP_PATH.read_text().strip() == date_value.isoformat()


def mark_scheduler_ran_for(date_value: date) -> None:
    SCHEDULER_STAMP_PATH.parent.mkdir(parents=True, exist_ok=True)
    SCHEDULER_STAMP_PATH.write_text(date_value.isoformat())