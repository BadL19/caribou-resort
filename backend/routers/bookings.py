from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import Booking, Cabin
from schemas.schemas import BookingCreate, BookingResponse
from email_service import send_booking_confirmation
from datetime import date
 
router = APIRouter(prefix="/bookings", tags=["bookings"])
 
 
@router.post("/", response_model=BookingResponse)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    cabin = db.query(Cabin).filter(Cabin.id == booking.cabin_id).first()
    if not cabin:
        raise HTTPException(status_code=404, detail="Cabin not found")
 
    if booking.start_date >= booking.end_date:
        raise HTTPException(status_code=400, detail="End date must be after start date")
 
    nights = (booking.end_date - booking.start_date).days
    if nights < 2:
        raise HTTPException(status_code=400, detail="Minimum stay is 2 nights")
 
    if booking.start_date < date.today():
        raise HTTPException(status_code=400, detail="Start date cannot be in the past")
 
    overlapping = db.query(Booking).filter(
        Booking.cabin_id == booking.cabin_id,
        Booking.start_date < booking.end_date,
        Booking.end_date > booking.start_date
    ).first()
 
    if overlapping:
        raise HTTPException(status_code=409, detail="Cabin is not available for the selected dates")
 
    total_price = nights * cabin.price_per_night
 
    db_booking = Booking(
        cabin_id=booking.cabin_id,
        guest_name=booking.guest_name,
        email=booking.email,
        phone=booking.phone,
        start_date=booking.start_date,
        end_date=booking.end_date,
        total_price=total_price,
        notes=booking.notes,
        num_guests=booking.num_guests if hasattr(booking, 'num_guests') else 1,
        source="website"
    )
 
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
 
    # Send confirmation email
    try:
        send_booking_confirmation(
            guest_name=booking.guest_name,
            guest_email=booking.email,
            cabin_name=cabin.name,
            start_date=str(booking.start_date),
            end_date=str(booking.end_date),
            nights=nights,
            total_price=total_price,
            booking_id=db_booking.id,
            phone=booking.phone,
            notes=booking.notes,
        )
    except Exception as e:
        print(f"Email error: {e}")
 
    return db_booking