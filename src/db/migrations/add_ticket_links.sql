CREATE TABLE IF NOT EXISTS ticket_link_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_default BOOLEAN DEFAULT 0,
    color TEXT
);


CREATE TABLE IF NOT EXISTS ticket_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER,
    link_type_id INTEGER,
    label TEXT,
    link TEXT,
    FOREIGN KEY(ticket_id) REFERENCES tickets(id),
    FOREIGN KEY(link_type_id) REFERENCES ticket_link_types(id)
);

INSERT INTO ticket_link_types (name, description, is_default, color) VALUES
('Documentation', 'Links to documentation related to the ticket', 1, '#3498db'),
('Related Ticket', 'Links to another related ticket', 1, '#2ecc71'),
('Photos', 'Links to photos related to the ticket', 1, '#9b59b6'),
('Web Link', 'Links to an external resource', 1, '#e67e22');
