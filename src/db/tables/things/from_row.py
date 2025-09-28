from .base import Thing


@classmethod
def from_row(cls, **row) -> "Thing":
    row = dict(row)
    thing = cls(
        id=row["id"],
        category_id=row["category_id"],
        name=row["name"],
        description=row["description"],
        docs_link=row["docs_link"],
        parent_id=row.get("parent_id"),
    )
    if "category_name" in row.keys():
        from ..categories import ThingCategory

        thing.category = ThingCategory(
            id=row["category_id"],
            name=row.get("category_name", ""),
            description=row.get("category_description", ""),
        )
    if "parent_name" in row.keys() and row.get("parent_id") is not None:
        thing.parent = Thing(
            id=row.get("parent_id"),
            name=row.get("parent_name", ""),
            description=row.get("parent_description", None),
            docs_link=row.get("parent_docs_link", None),
        )
    return thing
