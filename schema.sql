-- Create the 'users' table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Changed to TEXT for UUID
    username TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'todos' table
CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY, -- Changed to TEXT for UUID
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    userId TEXT, -- Changed to TEXT for UUID foreign key
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
