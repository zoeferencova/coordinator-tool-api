DROP TYPE IF EXISTS status;
CREATE TYPE status AS ENUM (
    'none',
    'reached',
    'completed'
);

CREATE TABLE IF NOT EXISTS coordinator_list_items (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id INTEGER REFERENCES coordinator_users(id),
    status status NOT NULL,
    project TEXT NOT NULL,
    advisor TEXT NOT NULL,
    pm_id INTEGER REFERENCES coordinator_pms(id),
    date DATE DEFAULT now() NOT NULL,
    notes TEXT
);