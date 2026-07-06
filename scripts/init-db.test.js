const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const SCRIPT_PATH = path.resolve(__dirname, './init-db.js');
const TEST_DB_PATH = path.resolve(__dirname, '../test_db.sqlite');
const SCHEMA_PATH = path.resolve(__dirname, '../schema.sql'); // Ensure schema path is correct for test context

describe('Database Initialization Script', () => {
    beforeEach(() => {
        // Clean up any previous test database
        if (fs.existsSync(TEST_DB_PATH)) {
            fs.unlinkSync(TEST_DB_PATH);
        }
        // Mock schema.sql for testing purposes if needed, or ensure it's accessible.
        // For this test, we'll assume schema.sql is directly accessible.
    });

    afterEach(() => {
        if (fs.existsSync(TEST_DB_PATH)) {
            fs.unlinkSync(TEST_DB_PATH);
        }
    });

    test('should create tables if they do not exist', (done) => {
        // Set the environment variable for the script to use the test DB
        const env = { ...process.env, DB_PATH: TEST_DB_PATH, SCHEMA_PATH: SCHEMA_PATH };

        exec(`node ${SCRIPT_PATH}`, { env }, (error, stdout, stderr) => {
            expect(error).toBeNull();
            expect(stdout).toContain('Database initialized successfully.');

            const db = new sqlite3.Database(TEST_DB_PATH);
            db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, rows) => {
                expect(err).toBeNull();
                const tableNames = rows.map(row => row.name);
                expect(tableNames).toContain('users');
                expect(tableNames).toContain('todos');
                db.close(done);
            });
        });
    });

    test('should handle existing tables gracefully (idempotency)', (done) => {
        // First run to create tables
        const env = { ...process.env, DB_PATH: TEST_DB_PATH, SCHEMA_PATH: SCHEMA_PATH };
        exec(`node ${SCRIPT_PATH}`, { env }, (error, stdout, stderr) => {
            expect(error).toBeNull();
            expect(stdout).toContain('Database initialized successfully.');

            // Second run to test idempotency
            exec(`node ${SCRIPT_PATH}`, { env }, (error2, stdout2, stderr2) => {
                expect(error2).toBeNull();
                expect(stdout2).toContain('Database initialized successfully.');

                const db = new sqlite3.Database(TEST_DB_PATH);
                db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, rows) => {
                    expect(err).toBeNull();
                    const tableNames = rows.map(row => row.name);
                    expect(tableNames).toContain('users');
                    expect(tableNames).toContain('todos');
                    db.close(done);
                });
            });
        });
    });
});