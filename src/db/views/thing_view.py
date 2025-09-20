from typing import Optional
from pydantic import BaseModel

from ..controller import Thing, Category, ThingFilter


class ThingView(Thing):
    category: Optional[Category] = None


class ThingViewFilter(ThingFilter):
    search: Optional[str] = None


class ThingView:
    @staticmethod
    def list_thing_view(
        filters: Optional[ThingViewFilter] = None,
    ) -> list[ThingView]:
        query = """SELECT t.id, t.category_id, c.name as category_name, t.name, t.description, t.docs_link 
                   FROM things t
                   LEFT JOIN categories c ON t.category_id = c.id
                   WHERE t.name LIKE ?"""
        thing_views = []
        for thing in things:
            thing_view = ThingView(**thing.dict())
            if thing.category_id:
                category = Category.get_by_id(thing.category_id)
                thing_view.category = category
            thing_views.append(thing_view)
        return thing_views
