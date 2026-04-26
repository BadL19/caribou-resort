import requests
from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from database import get_db
from models.models import Booking, Cabin
from datetime import datetime, timezone
from icalendar import Calendar, Event
import uuid

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.get("/{cabin_id}/export.ics", response_class=PlainTextResponse)
def export_cabin_calendar(cabin_id: int, db: Session = Depends(get_db)):
    """Export cabin bookings as iCal feed for Airbnb to subscribe to."""
    cabin = db.query(Cabin).filter(Cabin.id == cabin_id).first()
    if not cabin:
        raise HTTPException(status_code=404, detail="Cabin not found")

    bookings = db.query(Booking).filter(Booking.cabin_id == cabin_id).all()

    cal = Calendar()
    cal.add('prodid', '-//Caribou Log Cabin Resort//EN')
    cal.add('version', '2.0')
    cal.add('calscale', 'GREGORIAN')
    cal.add('method', 'PUBLISH')
    cal.add('x-wr-calname', f'{cabin.name} — Caribou Log Cabin Resort')
    cal.add('x-wr-timezone', 'America/Toronto')

    for booking in bookings:
        event = Event()
        event.add('uid', f'booking-{booking.id}@cariboulogcabin.ca')
        event.add('summary', 'Reserved')
        event.add('dtstart', booking.start_date)
        event.add('dtend', booking.end_date)
        event.add('dtstamp', datetime.now(timezone.utc))
        event.add('status', 'CONFIRMED')
        cal.add_component(event)

    return Response(
        content=cal.to_ical().decode('utf-8'),
        media_type='text/calendar',
        headers={'Content-Disposition': f'attachment; filename="cabin-{cabin_id}.ics"'}
    )


@router.api_route("/{cabin_id}/sync-airbnb", methods=["GET", "POST"])
def sync_airbnb_calendar(cabin_id: int, ical_url: str, db: Session = Depends(get_db)):
    """Import Airbnb bookings from iCal URL and block those dates."""
    cabin = db.query(Cabin).filter(Cabin.id == cabin_id).first()
    if not cabin:
        raise HTTPException(status_code=404, detail="Cabin not found")

    try:
        response = requests.get(ical_url, timeout=10)
        response.raise_for_status()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not fetch Airbnb calendar: {e}")

    try:
        cal = Calendar.from_ical(response.content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid iCal format: {e}")

    imported = 0
    skipped = 0

    for component in cal.walk():
        if component.name != 'VEVENT':
            continue

        summary = str(component.get('summary', ''))
        if 'caribou' in summary.lower():
            continue

        try:
            dtstart = component.get('dtstart').dt
            dtend = component.get('dtend').dt

            # Convert datetime to date if needed
            if hasattr(dtstart, 'date'):
                dtstart = dtstart.date()
            if hasattr(dtend, 'date'):
                dtend = dtend.date()

            # Skip if dates are in the past
            from datetime import date
            if dtend <= date.today():
                continue

            # Check if already imported
            existing = db.query(Booking).filter(
                Booking.cabin_id == cabin_id,
                Booking.start_date == dtstart,
                Booking.end_date == dtend,
                Booking.source == 'airbnb'
            ).first()

            if existing:
                skipped += 1
                continue

            # Create blocking booking
            booking = Booking(
                cabin_id=cabin_id,
                guest_name='Airbnb Guest',
                email='airbnb@placeholder.com',
                phone='N/A',
                start_date=dtstart,
                end_date=dtend,
                total_price=0,
                num_guests=1,
                source='airbnb',
                notes='Imported from Airbnb calendar'
            )
            db.add(booking)
            imported += 1

        except Exception as e:
            print(f"Skipping event: {e}")
            continue

    db.commit()
    return {
        "message": f"Sync complete. {imported} new bookings imported, {skipped} already existed.",
        "cabin": cabin.name
    }