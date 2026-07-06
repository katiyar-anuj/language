
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.resolve(__dirname, '../../tmp/database.sqlite');
const SCHEMA_PATH = path.resolve(__dirname, '../../schema.sql');

// Ensure the directory for the database exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

fs.readFile(SCHEMA_PATH, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading schema.sql:', err.message);
        return;
    }

    db.exec(data, function(err) {
        if (err) {
            console.error('Error executing schema DDL:', err.message);
        } else {
            console.log('Database schema initialized or already exists.');
        }
        db.close((closeErr) => {
            if (closeErr) {
                console.error('Error closing database:', closeErr.message);
            } else {
                console.log('Database connection closed.');
            }
        });
    });
});
