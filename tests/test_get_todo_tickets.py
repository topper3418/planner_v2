from datetime import date, datetime
from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from src.app import app
from src.db.tables.tickets.base import Ticket
from src.db.tables.tickets.read import ReadTicketsResponse


client = TestClient(app)


def make_scheduled_ticket(*, open: bool = True, ticket_id: int = 106) -> Ticket:
    ticket = Ticket(
        id=ticket_id,
        title="Run Pool Robot",
        open=open,
        schedule_id=4,
        created_at=datetime(2026, 1, 1),
    )
    ticket.populate_category = MagicMock()
    ticket.should_show_scheduled_occurrence = MagicMock()
    return ticket


class TestGetTodoTicketsEndpoint:
    @patch("src.app.tickets.ensure_scheduled_tickets_reopened_for_today")
    @patch("src.app.tickets.Scheduler")
    @patch("src.app.tickets.Ticket.read")
    def test_includes_scheduled_ticket_when_occurrence_should_show(
        self, mock_ticket_read, mock_scheduler_cls, mock_ensure_scheduler
    ):
        due_response = ReadTicketsResponse(data=[], count=0)
        scheduled_ticket = make_scheduled_ticket(open=False)
        scheduled_ticket.should_show_scheduled_occurrence.return_value = True

        mock_ticket_read.return_value = due_response

        scheduler = MagicMock()
        scheduler.regen_tickets = [scheduled_ticket]
        mock_scheduler_cls.return_value = scheduler

        response = client.get("/tickets/todos/2026-07-14")

        assert response.status_code == 200
        body = response.json()
        assert body["count"] == 1
        assert body["data"][0]["id"] == 106
        scheduled_ticket.should_show_scheduled_occurrence.assert_called_once_with(
            date(2026, 7, 14)
        )
        scheduled_ticket.populate_category.assert_called_once()

    @patch("src.app.tickets.ensure_scheduled_tickets_reopened_for_today")
    @patch("src.app.tickets.Scheduler")
    @patch("src.app.tickets.Ticket.read")
    def test_excludes_scheduled_ticket_when_occurrence_should_hide(
        self, mock_ticket_read, mock_scheduler_cls, mock_ensure_scheduler
    ):
        due_response = ReadTicketsResponse(data=[], count=0)
        scheduled_ticket = make_scheduled_ticket(open=False)
        scheduled_ticket.should_show_scheduled_occurrence.return_value = False

        mock_ticket_read.return_value = due_response

        scheduler = MagicMock()
        scheduler.regen_tickets = [scheduled_ticket]
        mock_scheduler_cls.return_value = scheduler

        response = client.get("/tickets/todos/2026-07-08")

        assert response.status_code == 200
        body = response.json()
        assert body["count"] == 0
        assert body["data"] == []
        scheduled_ticket.populate_category.assert_not_called()

    @patch("src.app.tickets.ensure_scheduled_tickets_reopened_for_today")
    @patch("src.app.tickets.Scheduler")
    @patch("src.app.tickets.Ticket.read")
    def test_does_not_duplicate_ticket_already_due_that_day(
        self, mock_ticket_read, mock_scheduler_cls, mock_ensure_scheduler
    ):
        scheduled_ticket = make_scheduled_ticket(open=True)
        scheduled_ticket.should_show_scheduled_occurrence.return_value = True
        due_response = ReadTicketsResponse(data=[scheduled_ticket], count=1)

        mock_ticket_read.return_value = due_response

        scheduler = MagicMock()
        scheduler.regen_tickets = [scheduled_ticket]
        mock_scheduler_cls.return_value = scheduler

        response = client.get("/tickets/todos/2026-07-14")

        assert response.status_code == 200
        body = response.json()
        assert body["count"] == 1
        scheduled_ticket.populate_category.assert_not_called()

    @patch("src.app.tickets.ensure_scheduled_tickets_reopened_for_today")
    @patch("src.app.tickets.Scheduler")
    @patch("src.app.tickets.Ticket.read")
    def test_returns_400_for_invalid_date(
        self, mock_ticket_read, mock_scheduler_cls, mock_ensure_scheduler
    ):
        response = client.get("/tickets/todos/not-a-date")

        assert response.status_code == 400
        mock_ticket_read.assert_not_called()
        mock_scheduler_cls.assert_not_called()