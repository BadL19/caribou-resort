import os
import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
from models.models import Booking, Cabin
from schemas.schemas import BookingCreate, BookingResponse
from email_service import send_booking_confirmation
from datetime import date
from pydantic import BaseModel
from typing import Optional
 
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
 
router = APIRouter(prefix="/payments", tags=["payments"])
 
MAX_GUESTS = 5
 
 
class PaymentIntentRequest(BaseModel):
    cabin_id: int
    guest_name: str
    email: str
    phone: str
    start_date: date
    end_date: date
    num_guests: int = 1
    notes: Optional[str] = None
 
 
def validate_booking_data(booking_data: PaymentIntentRequest, db: Session):
    cabin = db.query(Cabin).filter(Cabin.id == booking_data.cabin_id).first()
    if not cabin:
        raise HTTPException(status_code=404, detail="Cabin not found")
 
    if booking_data.start_date >= booking_data.end_date:
        raise HTTPException(status_code=400, detail="End date must be after start date")
 
    nights = (booking_data.end_date - booking_data.start_date).days
    if nights < 2:
        raise HTTPException(status_code=400, detail="Minimum stay is 2 nights")
 
    if booking_data.start_date < date.today():
        raise HTTPException(status_code=400, detail="Start date cannot be in the past")
 
    if booking_data.num_guests > cabin.max_guests:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum {cabin.max_guests} guests allowed for {cabin.name}. For larger groups please contact us at (705)257-5434 to make arrangements."
        )
 
    overlapping = db.query(Booking).filter(
        Booking.cabin_id == booking_data.cabin_id,
        Booking.start_date < booking_data.end_date,
        Booking.end_date > booking_data.start_date
    ).first()
 
    if overlapping:
        raise HTTPException(status_code=409, detail="Cabin is not available for the selected dates")
 
    total = nights * cabin.price_per_night
    return cabin, nights, total
 
 
@router.post("/create-payment-intent")
def create_payment_intent(req: PaymentIntentRequest, db: Session = Depends(get_db)):
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe not configured. Set STRIPE_SECRET_KEY.")
 
    cabin, nights, total = validate_booking_data(req, db)
    amount_cents = int(total * 100)
 
    try:
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency="cad",
            description=f"{cabin.name} — {nights} nights — {req.start_date} to {req.end_date}",
            receipt_email=req.email,
            metadata={
                "cabin_id": req.cabin_id,
                "cabin_name": cabin.name,
                "guest_name": req.guest_name,
                "guest_email": req.email,
                "guest_phone": req.phone,
                "start_date": str(req.start_date),
                "end_date": str(req.end_date),
                "nights": nights,
                "total_price": total,
                "num_guests": req.num_guests,
                "notes": req.notes or "",
            },
        )
        return {
            "client_secret": intent.client_secret,
            "total_amount": total,
            "nights": nights,
            "cabin_name": cabin.name,
        }
    except stripe.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
 
 
@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")
 
    try:
        if STRIPE_WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
        else:
            import json
            event = json.loads(payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook error: {e}")
 
    if event["type"] == "payment_intent.succeeded":
        intent = event["data"]["object"]
        meta = intent.get("metadata", {})
 
        cabin_id = int(meta.get("cabin_id", 0))
        guest_name = meta.get("guest_name", "Guest")
        email = meta.get("guest_email", "")
        phone = meta.get("guest_phone", "")
        start_date_str = meta.get("start_date", "")
        end_date_str = meta.get("end_date", "")
        notes = meta.get("notes", "") or None
        total_price = float(meta.get("total_price", 0))
        nights = int(meta.get("nights", 0))
        cabin_name = meta.get("cabin_name", "")
        num_guests = int(meta.get("num_guests", 1))
 
        if not cabin_id or not start_date_str or not end_date_str:
            return {"status": "skipped — missing metadata"}
 
        start_date = date.fromisoformat(start_date_str)
        end_date = date.fromisoformat(end_date_str)
 
        existing = db.query(Booking).filter(
            Booking.cabin_id == cabin_id,
            Booking.start_date == start_date,
            Booking.email == email,
        ).first()
 
        if not existing:
            db_booking = Booking(
                cabin_id=cabin_id,
                guest_name=guest_name,
                email=email,
                phone=phone,
                start_date=start_date,
                end_date=end_date,
                total_price=total_price,
                notes=notes,
                num_guests=num_guests,
                source="website",
                stripe_payment_intent_id=intent["id"],
            )
            db.add(db_booking)
            db.commit()
            db.refresh(db_booking)
 
            send_booking_confirmation(
                guest_name=guest_name,
                guest_email=email,
                cabin_name=cabin_name,
                start_date=str(start_date),
                end_date=str(end_date),
                nights=nights,
                total_price=total_price,
                booking_id=db_booking.id,
                phone=phone,
                notes=notes,
            )
 
    return {"status": "ok"}