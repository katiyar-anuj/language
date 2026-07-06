-- Test schema creation

-- Create tables (should not error)
.read schema.sql

-- Verify users table schema
PRAGMA table_info(users);

-- Verify todos table schema
PRAGMA table_info(todos);

-- Insert test data into users
INSERT INTO users (id, username, passwordHash) VALUES ('user1-uuid', 'testuser', 'testhash');

-- Insert test data into todos, referencing a user
INSERT INTO todos (id, title, description, userId) VALUES ('todo1-uuid', 'Test Todo', 'This is a test todo', 'user1-uuid');

-- Verify data can be retrieved
SELECT * FROM users;
SELECT * FROM todos;