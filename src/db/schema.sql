CREATE TABLE IF NOT EXISTS thing_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_default BOOLEAN DEFAULT 0,
    color TEXT
);

CREATE TABLE IF NOT EXISTS action_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_default BOOLEAN DEFAULT 0,
    color TEXT
);

CREATE TABLE IF NOT EXISTS ticket_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_default BOOLEAN DEFAULT 0,
    color TEXT
);

CREATE TABLE IF NOT EXISTS things (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    docs_link TEXT,
    parent_id INTEGER,
    FOREIGN KEY(category_id) REFERENCES categories(id),
    FOREIGN KEY(parent_id) REFERENCES things(id)
);

CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    weekdays TEXT,
    monthdays TEXT,
    yeardays TEXT
);

CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    thing_id INTEGER,
    category_id INTEGER,
    parent_id INTEGER,
    user_id INTEGER,
    schedule_id INTEGER,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    open BOOLEAN DEFAULT 1,
    overdue BOOLEAN DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY(thing_id) REFERENCES things(id),
    FOREIGN KEY(category_id) REFERENCES ticket_categories(id),
    FOREIGN KEY(parent_id) REFERENCES tickets(id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(schedule_id) REFERENCES schedules(id)
);

CREATE TABLE IF NOT EXISTS actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER,
    action_text TEXT NOT NULL,
    action_type_id INTEGER,
    performed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(ticket_id) REFERENCES tickets(id),
    FOREIGN KEY(action_type_id) REFERENCES action_types(id)
);

CREATE TABLE IF NOT EXISTS milestones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    due_date DATETIME
);

CREATE TABLE IF NOT EXISTS ticket_milestones (
    ticket_id INTEGER,
    milestone_id INTEGER,
    PRIMARY KEY(ticket_id, milestone_id),
    FOREIGN KEY(ticket_id) REFERENCES tickets(id),
    FOREIGN KEY(milestone_id) REFERENCES milestones(id)
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE
);
