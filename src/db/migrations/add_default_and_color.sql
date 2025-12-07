
-- 1. thing_categories
ALTER TABLE thing_categories ADD COLUMN is_default BOOLEAN DEFAULT 0;
ALTER TABLE thing_categories ADD COLUMN color TEXT;

-- 2. action_types
ALTER TABLE action_types ADD COLUMN is_default BOOLEAN DEFAULT 0;
ALTER TABLE action_types ADD COLUMN color TEXT;

-- 3. ticket_categories
ALTER TABLE ticket_categories ADD COLUMN is_default BOOLEAN DEFAULT 0;
ALTER TABLE ticket_categories ADD COLUMN color TEXT;
