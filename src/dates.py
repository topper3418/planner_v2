"""
Single source of truth for datetime storage and calendar-day interpretation.

Storage convention
------------------
All timestamps written to SQLite are **naive UTC** datetimes. This matches
SQLite's ``CURRENT_TIMESTAMP`` default (which is UTC).

Calendar / display convention
-----------------------------
Calendar-day decisions (and user-facing day labels) use ``APP_TIMEZONE``
(default ``America/Chicago``). Convert stored UTC timestamps through
:func:`to_app_date` before comparing to a calendar day.
"""

from __future__ import annotations

from datetime import date, datetime, timezone
from functools import lru_cache
from zoneinfo import ZoneInfo

from .config import settings


@lru_cache(maxsize=1)
def app_zoneinfo() -> ZoneInfo:
    return ZoneInfo(settings.APP_TIMEZONE)


def ensure_utc(dt: datetime) -> datetime:
    """Return an aware UTC datetime.

    Naive values are treated as UTC (DB storage convention).
    """
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def utc_now() -> datetime:
    """Current UTC time as an aware datetime."""
    return datetime.now(timezone.utc)


def utc_now_naive() -> datetime:
    """Current UTC time as a naive datetime for DB writes.

    Matches SQLite ``CURRENT_TIMESTAMP`` storage.
    """
    return utc_now().replace(tzinfo=None)


def to_app_datetime(value: datetime | date | str | None) -> datetime | None:
    """Parse/normalize a stored timestamp to an aware datetime in app TZ."""
    if value is None:
        return None

    if isinstance(value, datetime):
        dt = value
    elif isinstance(value, date):
        # Pure dates are already calendar dates — interpret as midnight app-local.
        return datetime(
            value.year, value.month, value.day, tzinfo=app_zoneinfo()
        )
    elif isinstance(value, str):
        dt = parse_stored_datetime(value)
    else:
        raise TypeError(f"Unsupported datetime value type: {type(value)!r}")

    return ensure_utc(dt).astimezone(app_zoneinfo())


def to_app_date(value: datetime | date | str | None) -> date | None:
    """Calendar day in APP_TIMEZONE for a stored timestamp.

    Example (America/Chicago): ``2026-07-09T01:41:23`` (UTC) → ``2026-07-08``.
    """
    if value is None:
        return None
    if isinstance(value, date) and not isinstance(value, datetime):
        return value

    app_dt = to_app_datetime(value)
    if app_dt is None:
        return None
    return app_dt.date()


def app_today() -> date:
    """Today's calendar date in APP_TIMEZONE."""
    return datetime.now(app_zoneinfo()).date()


def app_now() -> datetime:
    """Current time as an aware datetime in APP_TIMEZONE."""
    return datetime.now(app_zoneinfo())


def parse_stored_datetime(value: str) -> datetime:
    """Parse a DB/API timestamp string as naive-UTC (or preserve offsets)."""
    text = value.strip()
    if text.endswith("Z"):
        text = text[:-1] + "+00:00"

    dt = datetime.fromisoformat(text)
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def format_date_key(value: date | datetime) -> str:
    """Format a calendar date as ``YYYY-MM-DD``."""
    if isinstance(value, datetime):
        value = to_app_date(value) or value.date()
    return value.isoformat()
