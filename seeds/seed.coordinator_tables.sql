BEGIN;

TRUNCATE
    coordinator_users,
    coordinator_templates,
    coordinator_pms,
    coordinator_list_items
    RESTART IDENTITY CASCADE;

INSERT INTO coordinator_users (full_name, email, password)
VALUES
    ('Zoe Ferencova', 'zoeferencova@gmail.com', '$2a$12$ynO.KJK.viPPu7aaVf1wLuQKvFIAEW.HaLF3Ij6fhmtnx9XB2AP3.'),
    ('Robin Hurst Ferenc', 'robin@gmail.com', '$2a$12$snsp1yDqA1gBkEhRyr1wseHoEDvOrGS/O6DrIdk0dHPlpSA3ijFHS'),
    ('James Park', 'james@gmail.com', '$2a$12$R0MyKY0l8dninJqTMjk0Ke7jTFAN6VlbLC7YEeCi4b0/.me5/ZML.'),
    ('Jane Doe', 'jane@gmail.com', '$2a$12$Wtf9GeIj/awVAB8tvAW75OThJPcHoCe3s1aEN559aKYlVRngLaIJy'),
    ('John Doe', 'john@gmail.com', '$2a$12$TvDry/9aDL8xi4h/kePF9ebFZwcGMqJhtCBrP9b5twe7wr3oAKBga');

INSERT INTO coordinator_templates (user_id, template_name, template_subject, template_content)
VALUES
    (1, 'Seed Template', 'Seed Subject', 'Hello, this is a seed email. Best, Zoe'),
    (2, 'Second Seed Template', 'Seed 2 Subject', 'Hello, this is another seed email. Best, Zoe'),
    (2, 'Third Seed Template', 'Seed 3 Subject', 'Hello, this is a third seed email. Best, Zoe'),
    (3, 'Fourth Seed Template', 'Seed 4 Subject', 'Hello, this is a fourth seed email. Best, Zoe'),
    (5, 'Fifth Seed Template', 'Seed 5 Subject', 'Hello, this is a fifth seed email. Best, Zoe');

INSERT INTO coordinator_pms (user_id, pm_name, pm_email)
VALUES
    (1, 'Josh Peem', 'josh@gmail.com'),
    (1, 'Zoe Proj', 'zoe@gmail.com'),
    (2, 'Proj Man', 'proj@gmail.com'),
    (3, 'James Peem', 'jamesp@gmail.com'),
    (4, 'Robin Man', 'robinm@gmail.com');

INSERT INTO coordinator_list_items (user_id, status, project, advisor, pm_id, notes)
VALUES
    (1, 'none', 'Sample Project', 'Advisor Name', 1, 'Need times for Mon/Tues'),
    (2, 'completed', 'Sample Project 2', 'Advisor Name', 1, 'Need times for Weds'),
    (3, 'reached', 'Sample Project 3', 'Advisor Name', 1, 'Follow up question'),
    (3, 'none', 'Sample Project 4', 'Advisor Name', 1, 'Notes'),
    (5, 'reached', 'Sample Project 5', 'Advisor Name', 1, 'Note');

COMMIT;