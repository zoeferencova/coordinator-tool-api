BEGIN;

TRUNCATE
    coordinator_users
    RESTART IDENTITY CASCADE;

INSERT INTO coordinator_users (full_name, email, password)
VALUES
    ('Zoe Ferencova', 'zoeferencova@gmail.com', 'ZoePass33!'),
    ('Robin Hurst Ferenc', 'robin@gmail.com', 'RobinPass12!'),
    ('James Park', 'james@gmail.com', 'JamesPass11!'),
    ('Jane Doe', 'jane@gmail.com', 'JanePass22!'),
    ('John Doe', 'john@gmail.com', 'JohnPass31!');

COMMIT;