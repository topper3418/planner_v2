from .. import Controller


Comment = Controller.Tables.Comment


def seed_comments(ticket_id_lookup):
    comment_id_lookup = {}

    def add_comment(ticket_title: str, content: str):
        ticket_id = ticket_id_lookup.get(ticket_title)
        comment = Comment(ticket_id=ticket_id, content=content)
        comment_id = comment.create()
        comment_id_lookup[f"{ticket_title}_{len(comment_id_lookup)+1}"] = (
            comment_id
        )
        print(
            f"Created comment on '{ticket_title}': {content[:30]}... (ID: {comment_id})"
        )
        return comment_id

    add_comment(
        ticket_title="Fix leaking pool pump",
        content="Inspected the pump, found a cracked seal that needs replacement.",
    )
    add_comment(
        ticket_title="Fix leaking pool pump",
        content="Ordered new seal, expected delivery in 3 days.",
    )
    add_comment(
        ticket_title="Upgrade laptop RAM",
        content="Verified current RAM is 8GB, planning to upgrade to 16GB.",
    )
    add_comment(
        ticket_title="Upgrade laptop RAM",
        content="Purchased compatible 16GB RAM modules.",
    )
    add_comment(
        ticket_title="Optimize database indexes",
        content="Analyzed query performance, identified missing indexes.",
    )
    add_comment(
        ticket_title="Optimize database indexes",
        content="Created new indexes, running performance tests now.",
    )

    return comment_id_lookup
