const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.resolve(__dirname, '../../tmp/database.sqlite');

describe('Database Initialization', () => {
  beforeEach(() => {
    // Clean up database before each test
    if (fs.existsSync(DB_PATH)) {
      fs.unlinkSync(DB_PATH);
    }
  });

  test('should create users and todos tables if they do not exist', (done) => {
    // Run the initialization script
    require('./init-db');

    const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        return done(err);
      }

      db.all("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('users', 'todos')", (err, rows) => {
        if (err) {
          db.close();
          return done(err);
        }

        expect(rows).toHaveLength(2);
        expect(rows.map(row => row.name)).toContain('users');
        expect(rows.map(row => row.name)).toContain('todos');

        db.close((closeErr) => {
          done(closeErr);
        });
      });
    });
  });

  test('should handle existing tables gracefully (idempotency)', (done) => {
    // Run the initialization script once
    require('./init-db');

    // Run the initialization script a second time
    require('./init-db');

    const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        return done(err);
      }

      db.all("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('users', 'todos')", (err, rows) => {
        if (err) {
          db.close();
          return done(err);
        }

        expect(rows).toHaveLength(2);
        db.close((closeErr) => {
          done(closeErr);
        });
      });
    });
  });
});
