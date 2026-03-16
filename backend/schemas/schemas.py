from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import date, datetime
from enum import Enum
 
 
class SeasonEnum(str, Enum):
    winter = "winter"
    summer = "summer"
    all_season = "all_season"
 
 
class BookingSourceEnum(str, Enum):
    website = "website"
    airbnb = "airbnb"
 
 
class CabinBase(BaseModel):
    name: str
    season: SeasonEnum
    description: str
    short_description: Optional[str] = None
    price_per_night: float
    amenities: Optional[List[str]] = []
    images: Optional[List[str]] = []
    max_guests: Optional[int] = 4
    bedrooms: Optional[int] = 1
 
 
class CabinResponse(CabinBase):
    id: int
 
    class Config:
        from_attributes = True
 
 
class BookingCreate(BaseModel):
    cabin_id: int
    guest_name: str
    email: str
    phone: str
    start_date: date
    end_date: date
    num_guests: int = 1
    notes: Optional[str] = None
 
 
class AirbnbBookingCreate(BaseModel):
    cabin_id: int
    guest_name: str = "Airbnb Guest"
    email: str = "airbnb@placeholder.com"
    phone: str = "N/A"
    start_date: date
    end_date: date
 
 
class BookingResponse(BaseModel):
    id: int
    cabin_id: int
    guest_name: str
    email: str
    phone: str
    start_date: date
    end_date: date
    source: BookingSourceEnum
    total_price: Optional[float]
    notes: Optional[str]
    created_at: datetime
 
    class Config:
        from_attributes = True
 
 
class AvailabilityCheck(BaseModel):
    start_date: date
    end_date: date