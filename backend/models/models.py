from sqlalchemy import Column, Integer, String, Float, Date, DateTime, JSON, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum
 
 
class SeasonEnum(str, enum.Enum):
    winter = "winter"
    summer = "summer"
    all_season = "all_season"
 
 
class BookingSourceEnum(str, enum.Enum):
    website = "website"
    airbnb = "airbnb"
 
 
class Cabin(Base):
    __tablename__ = "cabins"
 
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    season = Column(Enum(SeasonEnum), nullable=False)
    description = Column(String, nullable=False)
    short_description = Column(String)
    price_per_night = Column(Float, nullable=False)
    amenities = Column(JSON, default=[])
    images = Column(JSON, default=[])
    max_guests = Column(Integer, default=4)
    bedrooms = Column(Integer, default=1)
 
    bookings = relationship("Booking", back_populates="cabin")
 
 
class Booking(Base):
    __tablename__ = "bookings"
 
    id = Column(Integer, primary_key=True, index=True)
    cabin_id = Column(Integer, ForeignKey("cabins.id"), nullable=False)
    guest_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    source = Column(Enum(BookingSourceEnum), default=BookingSourceEnum.website)
    total_price = Column(Float)
    notes = Column(String)
    num_guests = Column(Integer, default=1)
    stripe_payment_intent_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
 
    cabin = relationship("Cabin", back_populates="bookings")