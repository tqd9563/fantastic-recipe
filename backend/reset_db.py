import os
import sys

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import Base, engine, DB_PATH, init_db
from app.main import BASE_DIR

print(f"Project Base Dir: {BASE_DIR}")
print(f"Database Path: {DB_PATH}")

if os.path.exists(DB_PATH):
    print(f"Removing existing database at {DB_PATH}")
    try:
        os.remove(DB_PATH)
        print("Database file removed.")
    except Exception as e:
        print(f"Error removing file: {e}")
else:
    print("Database file does not exist.")

print("Creating new tables...")
init_db()
print("Tables created.")

# Verify schema
from sqlalchemy import inspect
inspector = inspect(engine)
columns = [col['name'] for col in inspector.get_columns('recipes')]
print(f"Columns in 'recipes' table: {columns}")

if 'tags' in columns and 'rating' in columns:
    print("SUCCESS: New columns found!")
else:
    print("FAILURE: New columns missing!")

