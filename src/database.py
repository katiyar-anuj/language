import sqlite3
from typing import Optional

DATABASE_FILE = "database.sqlite"

def connect_db() -> Optional[sqlite3.Connection]:
    """
    Establishes a connection to the SQLite database.
    Creates the database file if it doesn't exist.
    Handles potential errors during connection.

    Returns:
        A sqlite3.Connection object if successful, None otherwise.
    """
    conn: Optional[sqlite3.Connection] = None
    try:
        conn = sqlite3.connect(DATABASE_FILE)
        print(f"Connected to database: {DATABASE_FILE}")
        return conn
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        return None

if __name__ == '__main__':
    # Example usage:
    db_connection = connect_db()
    if db_connection:
        # Perform some database operations here
        # For example, create a table:
        # cursor = db_connection.cursor()
        # cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)")
        # db_connection.commit()
        # print("Table 'users' created (if not already existing).")
        db_connection.close()
        print("Database connection closed.")
    else:
        print("Failed to establish database connection.")
