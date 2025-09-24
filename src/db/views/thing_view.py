from typing import Optional

from fastapi import Query

from ..util import get_db_connection
from ..controller import Thing, ThingFilter


class ThingView(Thing):
    category_name: Optional[str] = None


class ThingViewFilter(ThingFilter):
    search: Optional[str] = None


class ThingViewManager:
    @staticmethod
    def list(
        filters: ThingViewFilter = Query(),
    ) -> list[ThingView]:
        query = """
        SELECT t.id, t.category_id, c.name as category_name, t.name, t.description, t.docs_link 
        FROM things t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.name LIKE ?
        """
        args = [f"%{filters.name}%" if filters and filters.name else "%"]
        if filters and filters.category_id is not None:
            query += " AND t.category_id = ?"
            args.append(str(filters.category_id))
        if filters and filters.search:
            query += " AND (t.name LIKE ? OR t.description LIKE ?)"
            search_pattern = f"%{filters.search}%"
            args.extend([search_pattern, search_pattern])
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, args)
            rows = cursor.fetchall()
            return [ThingView(**row) for row in rows]
