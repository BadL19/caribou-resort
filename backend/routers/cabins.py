from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import Cabin, Booking
from schemas.schemas import CabinResponse, BookingResponse
from typing import List
from datetime import date

router = APIRouter(prefix="/cabins", tags=["cabins"])


@router.get("/", response_model=List[CabinResponse])
def get_cabins(db: Session = Depends(get_db)):
    return db.query(Cabin).all()


@router.get("/{cabin_id}", response_model=CabinResponse)
def get_cabin(cabin_id: int, db: Session = Depends(get_db)):
    cabin = db.query(Cabin).filter(Cabin.id == cabin_id).first()
    if not cabin:
        raise HTTPException(status_code=404, detail="Cabin not found")
    return cabin


@router.get("/{cabin_id}/bookings", response_model=List[BookingResponse])
def get_cabin_bookings(cabin_id: int, db: Session = Depends(get_db)):
    cabin = db.query(Cabin).filter(Cabin.id == cabin_id).first()
    if not cabin:
        raise HTTPException(status_code=404, detail="Cabin not found")
    bookings = db.query(Booking).filter(Booking.cabin_id == cabin_id).all()
    return bookings


@router.get("/{cabin_id}/availability")
def check_availability(
    cabin_id: int,
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db)
):
    cabin = db.query(Cabin).filter(Cabin.id == cabin_id).first()
    if not cabin:
        raise HTTPException(status_code=404, detail="Cabin not found")

    overlapping = db.query(Booking).filter(
        Booking.cabin_id == cabin_id,
        Booking.start_date < end_date,
        Booking.end_date > start_date
    ).first()

    return {"available": overlapping is None}
