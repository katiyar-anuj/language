const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, '../db.sqlite');
const SCHEMA_PATH = process.env.SCHEMA_PATH || path.resolve(__dirname, '../schema.sql');

async function initializeDatabase() {
    try {
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
        const db = new sqlite3.Database(DB_PATH);

        await new Promise((resolve, reject) => {
            db.exec(schema, (err) => {
                if (err) {
                    console.error('Error executing schema:', err.message);
                    reject(err);
                } else {
                    console.log('Database initialized successfully.');
                    resolve();
                }
            });
        });

        db.close();
    } catch (error) {
        console.error('Failed to initialize database:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    initializeDatabase();
}