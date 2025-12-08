INSERT OR IGNORE INTO action_types 
    (name, description, is_default, color)
VALUES 
    ('Comments', 'Added a comment to the ticket', 0, '#a3a3c2');
INSERT INTO actions (ticket_id, action_text, action_type_id, performed_at)
SELECT
c.ticket_id,
c.content,
(SELECT id FROM action_types WHERE name = 'Comments'),
c.created_at
FROM comments c;
DROP TABLE comments;
