"""Add num_guests column to bookings table."""
from database import engine
from sqlalchemy import text
 
with engine.connect() as conn:
    conn.execute(text("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS num_guests INTEGER DEFAULT 1"))
    conn.commit()
    print("Migration complete — num_guests column added.")
 