SELECT 
   tickets.id, 
   tickets.title, 
   tickets.description, 
   tickets.open, 
   tickets.created_at, 
   tickets.updated_at, 
   tickets.completed_at, 
   tickets.thing_id, 
   tickets.category_id, 
   tickets.parent_id, 
   things.id AS thing_id, 
   things.name AS thing_name, 
   things.description AS thing_description, 
   things.docs_link AS thing_docs_link, 
   things.category_id AS thing_category_id, 
   things.parent_id AS thing_parent_id, 
   ticket_categories.id AS category_id, 
   ticket_categories.name AS category_name, 
   ticket_categories.description AS category_description
FROM tickets
LEFT JOIN things ON tickets.thing_id = things.id 
LEFT JOIN ticket_categories ON tickets.category_id = ticket_categories.id 
WHERE tickets.thing_id IN (1, 2, 3)
  AND tickets.category_id = 5
  AND tickets.open = true
LIMIT 10 OFFSET 0;
