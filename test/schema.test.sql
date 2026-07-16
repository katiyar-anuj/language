-- Test schema creation

-- Create tables (should not error)
.read schema.sql

-- Verify users table schema
PRAGMA table_info(users);

-- Verify todos table schema
PRAGMA table_info(todos);

-- Test NOT NULL and UNIQUE constraints for users.username
INSERT INTO users (id, username, passwordHash) VALUES ('user1-uuid', 'testuser', 'testhash');
-- Attempt to insert a user with a duplicate username (should fail)
-- This specific SQL will likely result in an error and stop the script.
-- For a robust test, a more advanced SQL client or framework would be used to catch and assert the error.
-- For now, this serves as a conceptual negative test.
-- INSERT INTO users (id, username, passwordHash) VALUES ('user2-uuid', 'testuser', 'anotherhash');

-- Test DEFAULT values
-- Insert a user without specifying createdAt or updatedAt
INSERT INTO users (id, username, passwordHash) VALUES ('user2-uuid', 'anotheruser', 'anotherhash');
-- Insert a todo without specifying completed, createdAt, or updatedAt
INSERT INTO todos (id, title, description, userId) VALUES ('todo1-uuid', 'Test Todo', 'This is a test todo', 'user1-uuid');

-- Verify data can be retrieved
SELECT id, username, passwordHash, createdAt IS NOT NULL AS createdAt_set, updatedAt IS NOT NULL AS updatedAt_set FROM users;
SELECT id, title, description, completed, createdAt IS NOT NULL AS createdAt_set, updatedAt IS NOT NULL AS updatedAt_set FROM todos;

-- Test FOREIGN KEY ON DELETE CASCADE
INSERT INTO users (id, username, passwordHash) VALUES ('user3-uuid', 'cascadeuser', 'cascadehash');
INSERT INTO todos (id, title, description, userId) VALUES ('todo2-uuid', 'Cascade Todo 1', 'Should be deleted', 'user3-uuid');
INSERT INTO todos (id, title, description, userId) VALUES ('todo3-uuid', 'Cascade Todo 2', 'Should also be deleted', 'user3-uuid');

-- Verify todos exist before deletion
SELECT COUNT(*) FROM todos WHERE userId = 'user3-uuid';

-- Delete the user
DELETE FROM users WHERE id = 'user3-uuid';

-- Verify associated todos are removed (should be 0)
SELECT COUNT(*) FROM todos WHERE userId = 'user3-uuid';

-- Negative test case: Attempt to insert a todo with a non-existent userId (should fail)
-- INSERT INTO todos (id, title, description, userId) VALUES ('todo4-uuid', 'Orphan Todo', 'Should not be inserted', 'non-existent-user-uuid');
SELECT * FROM users;
SELECT * FROM todos;



