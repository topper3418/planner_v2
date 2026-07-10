from datetime import date, datetime
from unittest.mock import MagicMock, patch

import pytest

from src.db.tables.actions.read import ReadActionsResponse
from src.db.tables.actions.base import Action
from src.db.tables.tickets.base import Ticket
from src.db.tables.tickets.should_show_scheduled_occurrence import (
    get_most_recent_completion_date,
    should_show_scheduled_occurrence,
)


TODAY = date(2026, 7, 9)
LAST_COMPLETION = date(2026, 7, 7)


def make_ticket(*, open: bool = True, ticket_id: int = 1) -> Ticket:
    return Ticket(id=ticket_id, title="Scheduled chore", open=open, schedule_id=4)


def make_completion_action(performed_at: datetime, action_id: int = 1) -> Action:
    return Action(
        id=action_id,
        ticket_id=1,
        action_type_id=1,
        performed_at=performed_at,
    )


class TestGetMostRecentCompletionDate:
    @patch("src.db.tables.actions.Action.read")
    def test_returns_none_when_no_completions(self, mock_read):
        mock_read.return_value = ReadActionsResponse(data=[], count=0)

        assert get_most_recent_completion_date(1) is None

    @patch("src.db.tables.actions.Action.read")
    def test_returns_none_when_completions_have_no_timestamp(self, mock_read):
        mock_read.return_value = ReadActionsResponse(
            data=[Action(id=1, ticket_id=1, action_type_id=1, performed_at=None)],
            count=1,
        )

        assert get_most_recent_completion_date(1) is None

    @patch("src.db.tables.actions.Action.read")
    def test_returns_latest_completion_date(self, mock_read):
        mock_read.return_value = ReadActionsResponse(
            data=[
                make_completion_action(datetime(2026, 7, 1, 9, 0), action_id=1),
                make_completion_action(datetime(2026, 7, 7, 15, 30), action_id=2),
                make_completion_action(datetime(2026, 6, 20, 8, 0), action_id=3),
            ],
            count=3,
        )

        assert get_most_recent_completion_date(1) == date(2026, 7, 7)

    @patch("src.db.tables.actions.Action.read")
    def test_utc_evening_completion_maps_to_previous_local_day(self, mock_read):
        """Regression: Pool Robot completed ~8:41pm CDT stored as UTC next day."""
        mock_read.return_value = ReadActionsResponse(
            data=[
                # 2026-07-09 01:41 UTC == 2026-07-08 20:41 America/Chicago
                make_completion_action(datetime(2026, 7, 9, 1, 41, 23)),
            ],
            count=1,
        )

        assert get_most_recent_completion_date(1) == date(2026, 7, 8)

    @patch("src.db.tables.actions.Action.read")
    def test_utc_evening_string_maps_to_previous_local_day(self, mock_read):
        mock_read.return_value = ReadActionsResponse(
            data=[
                make_completion_action("2026-07-09T01:41:23"),  # type: ignore[arg-type]
            ],
            count=1,
        )

        assert get_most_recent_completion_date(1) == date(2026, 7, 8)

    @patch("src.db.tables.actions.Action.read")
    def test_queries_completed_actions_for_ticket(self, mock_read):
        mock_read.return_value = ReadActionsResponse(data=[], count=0)

        get_most_recent_completion_date(42)

        mock_read.assert_called_once()
        params = mock_read.call_args[0][0]
        assert params.ticket_id == 42
        assert params.action_type_name == "Completed"


class TestShouldShowScheduledOccurrence:
    @patch(
        "src.db.tables.tickets.should_show_scheduled_occurrence.get_most_recent_completion_date"
    )
    def test_shows_all_occurrences_when_never_completed(self, mock_last_completion):
        mock_last_completion.return_value = None
        ticket = make_ticket(open=False)

        assert should_show_scheduled_occurrence(
            ticket, date(2026, 7, 1), today=TODAY
        ) is True
        assert should_show_scheduled_occurrence(
            ticket, date(2026, 7, 20), today=TODAY
        ) is True

    @patch(
        "src.db.tables.tickets.should_show_scheduled_occurrence.get_most_recent_completion_date"
    )
    def test_hides_occurrences_on_or_before_last_completion(self, mock_last_completion):
        mock_last_completion.return_value = LAST_COMPLETION
        ticket = make_ticket(open=True)

        assert should_show_scheduled_occurrence(
            ticket, date(2026, 7, 6), today=TODAY
        ) is False
        assert should_show_scheduled_occurrence(
            ticket, LAST_COMPLETION, today=TODAY
        ) is False

    @patch(
        "src.db.tables.tickets.should_show_scheduled_occurrence.get_most_recent_completion_date"
    )
    def test_closed_ticket_hides_past_occurrences_after_completion(
        self, mock_last_completion
    ):
        mock_last_completion.return_value = LAST_COMPLETION
        ticket = make_ticket(open=False)

        assert should_show_scheduled_occurrence(
            ticket, date(2026, 7, 8), today=TODAY
        ) is False

    @patch(
        "src.db.tables.tickets.should_show_scheduled_occurrence.get_most_recent_completion_date"
    )
    def test_closed_ticket_shows_future_occurrences_after_completion(
        self, mock_last_completion
    ):
        mock_last_completion.return_value = LAST_COMPLETION
        ticket = make_ticket(open=False)

        assert should_show_scheduled_occurrence(
            ticket, date(2026, 7, 14), today=TODAY
        ) is True

    @patch(
        "src.db.tables.tickets.should_show_scheduled_occurrence.get_most_recent_completion_date"
    )
    def test_reopened_ticket_shows_occurrences_after_last_completion(
        self, mock_last_completion
    ):
        mock_last_completion.return_value = LAST_COMPLETION
        ticket = make_ticket(open=True)

        assert should_show_scheduled_occurrence(
            ticket, date(2026, 7, 8), today=TODAY
        ) is True
        assert should_show_scheduled_occurrence(
            ticket, date(2026, 7, 14), today=TODAY
        ) is True

    @patch(
        "src.db.tables.tickets.should_show_scheduled_occurrence.get_most_recent_completion_date"
    )
    def test_uses_most_recent_completion_not_older_cycles(self, mock_last_completion):
        mock_last_completion.return_value = date(2026, 7, 20)
        ticket = make_ticket(open=True)

        assert should_show_scheduled_occurrence(
            ticket, date(2026, 7, 10), today=date(2026, 7, 25)
        ) is False
        assert should_show_scheduled_occurrence(
            ticket, date(2026, 7, 21), today=date(2026, 7, 25)
        ) is True

    @patch(
        "src.db.tables.tickets.should_show_scheduled_occurrence.get_most_recent_completion_date"
    )
    def test_closed_ticket_does_not_show_today_after_completion(
        self, mock_last_completion
    ):
        mock_last_completion.return_value = TODAY
        ticket = make_ticket(open=False)

        assert should_show_scheduled_occurrence(
            ticket, TODAY, today=TODAY
        ) is False

    @patch(
        "src.db.tables.tickets.should_show_scheduled_occurrence.get_most_recent_completion_date"
    )
    def test_reopened_ticket_shows_today_when_after_last_completion(
        self, mock_last_completion
    ):
        mock_last_completion.return_value = date(2026, 7, 8)
        ticket = make_ticket(open=True)

        assert should_show_scheduled_occurrence(
            ticket, TODAY, today=TODAY
        ) is True

    @patch("src.db.tables.actions.Action.read")
    def test_pool_robot_regression_reopened_after_utc_evening_completion(
        self, mock_read
    ):
        """
        End-to-end of the calendar bug:
        - Completion stored as UTC 2026-07-09T01:41:23 (local 7/8 8:41pm)
        - Ticket reopened the next local morning (open=True)
        - Calendar day 2026-07-09 must show the ticket
        """
        mock_read.return_value = ReadActionsResponse(
            data=[make_completion_action(datetime(2026, 7, 9, 1, 41, 23))],
            count=1,
        )
        ticket = make_ticket(open=True)

        assert should_show_scheduled_occurrence(
            ticket, date(2026, 7, 9), today=date(2026, 7, 9)
        ) is True
        # Still hidden on the local completion day itself
        assert should_show_scheduled_occurrence(
            ticket, date(2026, 7, 8), today=date(2026, 7, 9)
        ) is False

    @patch(
        "src.db.tables.tickets.should_show_scheduled_occurrence.get_most_recent_completion_date"
    )
    @pytest.mark.parametrize(
        ("occurrence", "open", "expected"),
        [
            (date(2026, 7, 1), False, False),
            (date(2026, 7, 1), True, False),
            (date(2026, 7, 7), False, False),
            (date(2026, 7, 7), True, False),
            (date(2026, 7, 8), False, False),
            (date(2026, 7, 8), True, True),
            (date(2026, 7, 14), False, True),
            (date(2026, 7, 14), True, True),
        ],
    )
    def test_matrix_around_completion(
        self, mock_last_completion, occurrence, open, expected
    ):
        mock_last_completion.return_value = LAST_COMPLETION
        ticket = make_ticket(open=open)

        assert (
            should_show_scheduled_occurrence(ticket, occurrence, today=TODAY)
            is expected
        )