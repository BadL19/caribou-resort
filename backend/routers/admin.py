from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import Booking, Cabin
from schemas.schemas import AirbnbBookingCreate, BookingResponse, BookingCreate
from typing import List
import requests
from icalendar import Calendar
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/airbnb-booking", response_model=BookingResponse)
def create_airbnb_booking(booking: AirbnbBookingCreate, db: Session = Depends(get_db)):
    cabin = db.query(Cabin).filter(Cabin.id == booking.cabin_id).first()
    if not cabin:
        raise HTTPException(status_code=404, detail="Cabin not found")

    if booking.start_date >= booking.end_date:
        raise HTTPException(status_code=400, detail="End date must be after start date")

    nights = (booking.end_date - booking.start_date).days
    if nights < 1:
        raise HTTPException(status_code=400, detail="Invalid dates")

    overlapping = db.query(Booking).filter(
        Booking.cabin_id == booking.cabin_id,
        Booking.start_date < booking.end_date,
        Booking.end_date > booking.start_date
    ).first()

    if overlapping:
        raise HTTPException(status_code=409, detail="Dates overlap with existing booking")

    db_booking = Booking(
        cabin_id=booking.cabin_id,
        guest_name=booking.guest_name,
        email=booking.email,
        phone=booking.phone,
        start_date=booking.start_date,
        end_date=booking.end_date,
        total_price=nights * cabin.price_per_night,
        source="airbnb"
    )

    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


@router.get("/bookings", response_model=List[BookingResponse])
def get_all_bookings(db: Session = Depends(get_db)):
    return db.query(Booking).order_by(Booking.created_at.desc()).all()


@router.delete("/bookings/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return {"message": "Booking deleted"}


@router.post("/sync-ical/{cabin_id}")
def sync_ical(cabin_id: int, ical_url: str, db: Session = Depends(get_db)):
    """Sync Airbnb iCal feed to block dates"""
    cabin = db.query(Cabin).filter(Cabin.id == cabin_id).first()
    if not cabin:
        raise HTTPException(status_code=404, detail="Cabin not found")

    try:
        response = requests.get(ical_url, timeout=10)
        cal = Calendar.from_ical(response.content)
        imported = 0

        for component in cal.walk():
            if component.name == "VEVENT":
                dtstart = component.get("dtstart")
                dtend = component.get("dtend")
                summary = str(component.get("summary", "Airbnb Guest"))

                if dtstart and dtend:
                    start = dtstart.dt if hasattr(dtstart.dt, 'date') else dtstart.dt
                    end = dtend.dt if hasattr(dtend.dt, 'date') else dtend.dt

                    if hasattr(start, 'date'):
                        start = start.date()
                    if hasattr(end, 'date'):
                        end = end.date()

                    existing = db.query(Booking).filter(
                        Booking.cabin_id == cabin_id,
                        Booking.start_date == start,
                        Booking.end_date == end
                    ).first()

                    if not existing:
                        booking = Booking(
                            cabin_id=cabin_id,
                            guest_name=summary,
                            email="airbnb@sync.com",
                            phone="N/A",
                            start_date=start,
                            end_date=end,
                            source="airbnb"
                        )
                        db.add(booking)
                        imported += 1

        db.commit()
        return {"message": f"Synced {imported} new bookings from iCal"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to sync iCal: {str(e)}")
