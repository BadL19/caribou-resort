from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import Booking, Cabin
from schemas.schemas import BookingCreate, BookingResponse
from datetime import date

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("/", response_model=BookingResponse)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    # Validate cabin exists
    cabin = db.query(Cabin).filter(Cabin.id == booking.cabin_id).first()
    if not cabin:
        raise HTTPException(status_code=404, detail="Cabin not found")

    # Validate date order
    if booking.start_date >= booking.end_date:
        raise HTTPException(status_code=400, detail="End date must be after start date")

    # Validate minimum 2 nights
    nights = (booking.end_date - booking.start_date).days
    if nights < 2:
        raise HTTPException(status_code=400, detail="Minimum stay is 2 nights")

    # Validate start date is not in the past
    if booking.start_date < date.today():
        raise HTTPException(status_code=400, detail="Start date cannot be in the past")

    # Check for overlapping bookings
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
        source="website"
    )

    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking
