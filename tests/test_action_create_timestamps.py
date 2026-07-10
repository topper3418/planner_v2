"""Action create stamps UTC-naive performed_at / completed_at consistently."""

from datetime import datetime
from unittest.mock import MagicMock, patch

from src.db.tables.actions.base import Action
from src.db.tables.actions.create import create
from src.db.tables.categories.action_types import ActionType
from src.db.tables.tickets.base import Ticket


def _action_type(name: str, type_id: int = 6) -> ActionType:
    return ActionType(id=type_id, name=name)


class TestActionCreateTimestamps:
    @patch("src.db.tables.actions.create.core")
    @patch("src.db.tables.tickets.Ticket.get_by_id")
    @patch("src.db.tables.tickets.Ticket.update", create=True)
    @patch("src.db.tables.categories.ActionType.get_by_id")
    def test_sets_performed_at_when_missing(
        self, mock_type_get, mock_ticket_update, mock_ticket_get, mock_core
    ):
        mock_type_get.return_value = _action_type("Updated", type_id=3)
        mock_core.run_create.return_value = 99

        action = Action(
            ticket_id=106,
            action_type_id=3,
            action_text="note",
            performed_at=None,
        )
        create(action)

        assert action.performed_at is not None
        assert action.performed_at.tzinfo is None
        assert isinstance(action.performed_at, datetime)

    @patch("src.db.tables.actions.create.core")
    @patch("src.db.tables.tickets.Ticket.update")
    @patch("src.db.tables.tickets.Ticket.get_by_id")
    @patch("src.db.tables.categories.ActionType.get_by_id")
    def test_completed_uses_same_utc_timestamp(
        self, mock_type_get, mock_ticket_get, mock_ticket_update, mock_core
    ):
        mock_type_get.return_value = _action_type("Completed", type_id=6)
        mock_core.run_create.return_value = 100
        ticket = Ticket(id=106, title="Run Pool Robot", open=True)
        ticket.update = MagicMock()
        mock_ticket_get.return_value = ticket

        fixed = datetime(2026, 7, 9, 1, 41, 23)
        action = Action(
            ticket_id=106,
            action_type_id=6,
            action_text="robot run and returned to charger",
            performed_at=fixed,
        )
        create(action)

        assert ticket.open is False
        assert ticket.overdue is False
        assert ticket.completed_at == fixed
        ticket.update.assert_called_once()

    @patch("src.db.tables.actions.create.core")
    @patch("src.db.tables.tickets.Ticket.update")
    @patch("src.db.tables.tickets.Ticket.get_by_id")
    @patch("src.db.tables.categories.ActionType.get_by_id")
    def test_preserves_explicit_performed_at(
        self, mock_type_get, mock_ticket_get, mock_ticket_update, mock_core
    ):
        mock_type_get.return_value = _action_type("Updated", type_id=3)
        mock_core.run_create.return_value = 101
        fixed = datetime(2026, 1, 2, 3, 4, 5)

        action = Action(
            ticket_id=1,
            action_type_id=3,
            action_text="manual stamp",
            performed_at=fixed,
        )
        create(action)

        assert action.performed_at == fixed
