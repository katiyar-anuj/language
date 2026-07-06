import sys
import os
from pathlib import Path

# Add the parent directory of src to the Python path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from src.database import connect_db

if __name__ == "__main__":
    print("Initializing database...")
    try:
        db_connection = connect_db()
        if db_connection:
            print("Database initialized successfully.")
            db_connection.close()
        else:
            print("Failed to initialize database: Connection not established.")
            sys.exit(1)
    except Exception as e:
        print(f"An error occurred during database initialization: {e}")
        sys.exit(1)
