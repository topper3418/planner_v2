"""Tests for the shared datetime / calendar-day utilities."""

from datetime import date, datetime, timezone
from zoneinfo import ZoneInfo

import pytest

from src.dates import (
    app_today,
    ensure_utc,
    format_date_key,
    parse_stored_datetime,
    to_app_date,
    to_app_datetime,
    utc_now_naive,
)


class TestEnsureUtc:
    def test_naive_is_treated_as_utc(self):
        dt = datetime(2026, 7, 9, 1, 41, 23)
        result = ensure_utc(dt)
        assert result.tzinfo == timezone.utc
        assert result.hour == 1
        assert result.minute == 41

    def test_aware_is_converted_to_utc(self):
        cdt = ZoneInfo("America/Chicago")
        dt = datetime(2026, 7, 8, 20, 41, 23, tzinfo=cdt)
        result = ensure_utc(dt)
        assert result == datetime(2026, 7, 9, 1, 41, 23, tzinfo=timezone.utc)


class TestToAppDate:
    """Pool-robot regression: UTC evening instant must map to local prior day."""

    def test_utc_evening_becomes_previous_local_day_in_chicago(self):
        # 2026-07-09 01:41 UTC == 2026-07-08 20:41 CDT
        stored = datetime(2026, 7, 9, 1, 41, 23)
        assert to_app_date(stored) == date(2026, 7, 8)

    def test_utc_afternoon_stays_same_local_day(self):
        # 2026-07-08 16:53 UTC == 2026-07-08 11:53 CDT
        stored = datetime(2026, 7, 8, 16, 53, 49)
        assert to_app_date(stored) == date(2026, 7, 8)

    def test_string_naive_iso(self):
        assert to_app_date("2026-07-09T01:41:23") == date(2026, 7, 8)

    def test_string_with_z(self):
        assert to_app_date("2026-07-09T01:41:23Z") == date(2026, 7, 8)

    def test_string_with_offset(self):
        assert to_app_date("2026-07-08T20:41:23-05:00") == date(2026, 7, 8)

    def test_pure_date_passthrough(self):
        assert to_app_date(date(2026, 7, 9)) == date(2026, 7, 9)

    def test_none(self):
        assert to_app_date(None) is None

    def test_midday_utc_same_day_local(self):
        assert to_app_date(datetime(2026, 7, 9, 12, 0, 0)) == date(2026, 7, 9)

    def test_late_utc_evening_crosses_into_next_local_day(self):
        # 2026-07-09 23:30 UTC == 2026-07-09 18:30 CDT
        assert to_app_date(datetime(2026, 7, 9, 23, 30, 0)) == date(2026, 7, 9)


class TestParseStoredDatetime:
    def test_naive_gets_utc_tzinfo(self):
        dt = parse_stored_datetime("2026-07-09T01:41:23")
        assert dt.tzinfo == timezone.utc
        assert dt.hour == 1

    def test_z_suffix(self):
        dt = parse_stored_datetime("2026-07-09T01:41:23Z")
        assert dt == datetime(2026, 7, 9, 1, 41, 23, tzinfo=timezone.utc)

    def test_offset_preserved_as_utc_conversion_input(self):
        dt = parse_stored_datetime("2026-07-08T20:41:23-05:00")
        assert dt.utcoffset().total_seconds() == -5 * 3600


class TestUtcNowNaive:
    def test_is_naive(self):
        now = utc_now_naive()
        assert now.tzinfo is None

    def test_close_to_real_utc(self):
        now = utc_now_naive()
        real = datetime.now(timezone.utc).replace(tzinfo=None)
        assert abs((now - real).total_seconds()) < 2


class TestAppToday:
    def test_matches_chicago_today(self):
        expected = datetime.now(ZoneInfo("America/Chicago")).date()
        assert app_today() == expected


class TestToAppDatetime:
    def test_returns_aware_app_zone(self):
        result = to_app_datetime(datetime(2026, 7, 9, 1, 41, 23))
        assert result is not None
        assert result.tzinfo is not None
        assert result.hour == 20
        assert result.day == 8


class TestFormatDateKey:
    def test_date(self):
        assert format_date_key(date(2026, 7, 9)) == "2026-07-09"

    def test_datetime_uses_app_date(self):
        assert format_date_key(datetime(2026, 7, 9, 1, 41, 23)) == "2026-07-08"


class TestUnsupportedType:
    def test_raises_on_bad_type(self):
        with pytest.raises(TypeError):
            to_app_datetime(12345)  # type: ignore[arg-type]
