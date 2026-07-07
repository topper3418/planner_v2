from unittest.mock import patch

from fastapi.testclient import TestClient

from src.app import app

client = TestClient(app)


@patch("src.app.schedules.mark_scheduler_ran_for")
@patch("src.app.schedules.run_scheduled_ticket_reopening")
def test_run_schedules_endpoint(mock_run, mock_mark_ran):
    mock_run.return_value = {
        "matching_schedules": [{"id": 4, "name": "Every Day"}],
        "tickets_processed": 2,
        "tickets": [
            {
                "id": 106,
                "title": "Run Pool Robot",
                "was_open": False,
                "marked_overdue": False,
            },
        ],
    }

    response = client.post("/schedules/run")

    assert response.status_code == 200
    body = response.json()
    assert body["tickets_processed"] == 2
    assert body["matching_schedules"][0]["name"] == "Every Day"
    mock_run.assert_called_once_with(None)
    mock_mark_ran.assert_called_once()