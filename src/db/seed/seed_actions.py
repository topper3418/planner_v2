from typing import Optional

from .. import Database

Action = Database.Controller.Objects.Action
ActionType = Database.Controller.Objects.ActionType
ActionManager = Database.Controller.Managers.Action
ActionTypeManager = Database.Controller.Managers.ActionType


def seed_actions(ticket_id_lookup):
    action_type_lookup = {}

    def add_action_type(name: str, description: Optional[str] = None):
        action_type = ActionType(name=name, description=description)
        action_type_id = ActionTypeManager.create(action_type)
        action_type_lookup[name] = action_type_id
        print(f"Created action type: {name} (ID: {action_type_id})")
        return action_type_id

    # Seed Action Types
    action_types = [
        ("Diagnosed", "Identified the issue"),
        ("Repaired", "Fixed the problem"),
        ("Updated", "Applied updates or patches"),
        ("Maintained", "Performed routine maintenance"),
        ("Inspected", "Checked the condition"),
    ]
    for name, description in action_types:
        add_action_type(name, description)

    action_id_lookup = {}

    def add_action(
        action_text: str, ticket_title: str, action_type_name: str
    ):
        ticket_id = ticket_id_lookup.get(ticket_title)
        action_type_id = action_type_lookup.get(action_type_name)
        action = Action(
            action_text=action_text,
            ticket_id=ticket_id,
            action_type_id=action_type_id,
        )
        action_id = ActionManager.create(action)
        action_id_lookup[f"{ticket_title}-{action_type_name}"] = action_id
        print(f"Created action: {action_text} (ID: {action_id})")
        return action_id

    actions = [
        (
            "Checked thermal paste, needs replacement",
            "Repair laptop overheating",
            "Diagnosed",
        ),
        (
            "Replaced thermal paste and cleaned fans",
            "Repair laptop overheating",
            "Repaired",
        ),
        (
            "Optimized database indexes for performance",
            "Optimize database queries",
            "Updated",
        ),
        (
            "Scheduled regular maintenance for HVAC system",
            "Annual HVAC maintenance",
            "Maintained",
        ),
        (
            "Inspected roof for damage after storm",
            "Inspect roof for damage",
            "Inspected",
        ),
        (
            "Replaced damaged shingles and sealed leaks",
            "Inspect roof for damage",
            "Repaired",
        ),
        (
            "Upgraded RAM from 8GB to 16GB",
            "Upgrade laptop RAM",
            "Updated",
        ),
        (
            "Diagnosed network latency issues",
            "Fix network latency",
            "Diagnosed",
        ),
        (
            "Replaced faulty router",
            "Fix network latency",
            "Repaired",
        ),
    ]
    for action_text, ticket_title, action_type_name in actions:
        add_action(action_text, ticket_title, action_type_name)

    return action_id_lookup
