from datetime import date
from unittest.mock import patch

from src.scheduler.daily_guard import (
    SCHEDULER_STAMP_PATH,
    mark_scheduler_ran_for,
    scheduler_ran_for,
)
from src.scheduler.run import ensure_scheduled_tickets_reopened_for_today


class TestSchedulerDailyGuard:
    def setup_method(self):
        if SCHEDULER_STAMP_PATH.exists():
            SCHEDULER_STAMP_PATH.unlink()

    def teardown_method(self):
        if SCHEDULER_STAMP_PATH.exists():
            SCHEDULER_STAMP_PATH.unlink()

    def test_scheduler_ran_for_returns_false_when_stamp_missing(self):
        assert scheduler_ran_for(date(2026, 7, 7)) is False

    def test_mark_and_check_scheduler_ran_for(self):
        mark_scheduler_ran_for(date(2026, 7, 7))

        assert scheduler_ran_for(date(2026, 7, 7)) is True
        assert scheduler_ran_for(date(2026, 7, 8)) is False


class TestEnsureScheduledTicketsReopenedForToday:
    def setup_method(self):
        if SCHEDULER_STAMP_PATH.exists():
            SCHEDULER_STAMP_PATH.unlink()

    def teardown_method(self):
        if SCHEDULER_STAMP_PATH.exists():
            SCHEDULER_STAMP_PATH.unlink()

    @patch("src.scheduler.run.date")
    @patch("src.scheduler.run.run_scheduled_ticket_reopening")
    def test_runs_scheduler_once_per_day(self, mock_run, mock_date):
        mock_date.today.return_value = date(2026, 7, 7)
        mock_run.return_value = {
            "matching_schedules": [],
            "tickets_processed": 0,
            "tickets": [],
        }

        first = ensure_scheduled_tickets_reopened_for_today()
        second = ensure_scheduled_tickets_reopened_for_today()

        assert first is not None
        assert second is None
        mock_run.assert_called_once_with(
            date(2026, 7, 7),
            reopen_only_closed=True,
        )
        assert scheduler_ran_for(date(2026, 7, 7)) is True