from typing import Optional

from .. import Controller

Action = Controller.Tables.Action
ActionType = Controller.Tables.ActionType


def seed_actions(ticket_id_lookup={}, dev=True):
    action_type_lookup = {}

    def add_action_type(
        name: str,
        description: Optional[str] = None,
        is_default: bool = False,
        color: Optional[str] = None,
    ):
        action_type = ActionType(
            name=name,
            description=description,
            is_default=is_default,
            color=color,
        )
        action_type_id = action_type.create()
        action_type_lookup[name] = action_type_id
        print(f"Created action type: {name} (ID: {action_type_id})")
        return action_type_id

    # Seed Action Types
    action_types = [
        ("Completed", "Finished the ticket", True, "#1e9c0b"),
        (
            "Reopened",
            "Reopened a previously closed ticket",
            True,
            "#f07007",
        ),
        ("Comments", "Added a comment to the ticket", True, "#a3a3c2"),
        ("Cancelled", "Cancelled the ticket", True, "#ff0000"),
    ]
    for name, description, is_default, color in action_types:
        add_action_type(name, description, is_default, color)

    action_id_lookup = {}

    if not dev:
        return action_id_lookup

    dev_action_types = [
        ("Diagnosed", "Identified the issue", False, "#f2d024"),
        ("Repaired", "Fixed the problem", False, "#0b74de"),
        ("Updated", "Applied updates or patches", False, "#8e44ad"),
        ("Maintained", "Performed routine maintenance", False, "#16a085"),
        ("Inspected", "Checked the condition", False, "#d35400"),
    ]
    for name, description, is_default, color in dev_action_types:
        add_action_type(name, description, is_default, color)
    action_types.extend(dev_action_types)

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
        action_id = action.create()
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
        (
            "Fix leaking pool pump",
            "Inspected the pump, found a cracked seal that needs replacement.",
            "Comments",
        ),
        (
            "Fix leaking pool pump",
            "Ordered new seal, expected delivery in 3 days.",
            "Comments",
        ),
        (
            "Upgrade laptop RAM",
            "Verified current RAM is 8GB, planning to upgrade to 16GB.",
            "Comments",
        ),
        (
            "Upgrade laptop RAM",
            "Purchased compatible 16GB RAM modules.",
            "Comments",
        ),
        (
            "Optimize database indexes",
            "Analyzed query performance, identified missing indexes.",
            "Comments",
        ),
        (
            "Optimize database indexes",
            "Created new indexes, running performance tests now.",
            "Comments",
        ),
    ]
    for action_text, ticket_title, action_type_name in actions:
        add_action(action_text, ticket_title, action_type_name)

    return action_id_lookup
