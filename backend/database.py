from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
 
load_dotenv()
 
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres123@localhost:5433/caribou_resort")
 
# Add SSL for Supabase/production, skip for local
connect_args = {}
if "supabase.com" in DATABASE_URL or "supabase.co" in DATABASE_URL or "render.com" in DATABASE_URL:
    connect_args = {"sslmode": "require"}
 
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
 
 
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
 