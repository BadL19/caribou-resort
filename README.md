Caribou Log Cabin Resort
Full-stack cabin booking website for Caribou Log Cabin Resort — a lakeside property in Desbarats, Ontario.
Live site: caribou-resort1.onrender.com

About the Resort
Three lakeside cabins available for rent on Caribou Lake in Desbarats, Ontario. Fishing, bonfires, and quiet nights — about 1 hour east of Sault Ste. Marie.
Address: 239 Carter Side Rd, Desbarats, ON
Phone: (705)257-5434
Email: cariboulogcabinresort@gmail.com

Tech Stack
Frontend

React + Vite
Tailwind CSS
Stripe.js (payments)
Axios (API calls)

Backend

FastAPI (Python)
PostgreSQL + SQLAlchemy
Stripe (payment processing)
Resend (email confirmations)

Infrastructure

Frontend: Render Static Site — caribou-resort1.onrender.com
Backend: Render Web Service — caribou-resort.onrender.com
Database: Render PostgreSQL


Features

Browse 3 cabins with photo galleries and details
Real-time availability calendar with blocked dates
Full Stripe payment integration — full payment required at booking
Guest count validation — max 5 guests per cabin
Email confirmation sent to guest on successful booking
Admin notification on each new booking
Photo gallery with lightbox viewer
Homepage slideshow
Fully mobile responsive
FAQ page
Airbnb date blocking via admin panel


Project Structure
caribou-resort/
├── README.md
├── backend/
│   ├── main.py                    # FastAPI app + CORS config
│   ├── database.py                # SQLAlchemy engine + session
│   ├── email_service.py           # Resend email confirmations
│   ├── seed.py                    # Database seed — 3 cabins
│   ├── migrate_add_guests.py      # Migration — adds num_guests column
│   ├── requirements.txt
│   ├── .env.example
│   ├── models/
│   │   └── models.py              # Cabin + Booking SQLAlchemy models
│   ├── routers/
│   │   ├── cabins.py              # GET /cabins, /cabins/{id}, availability
│   │   ├── bookings.py            # POST /bookings
│   │   ├── payments.py            # Stripe PaymentIntent + webhook
│   │   └── admin.py               # Admin endpoints + Airbnb iCal sync
│   └── schemas/
│       └── schemas.py             # Pydantic request/response schemas
└── frontend/
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.js
    ├── .env.example
    ├── public/
    │   ├── logo.png
    │   ├── _redirects             # Render SPA routing
    │   └── images/
    │       └── gallery/           # All cabin + property photos
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── CabinCard.jsx
        │   └── BookingCalendar.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Cabins.jsx
        │   ├── CabinDetail.jsx
        │   ├── Gallery.jsx
        │   ├── FAQ.jsx
        │   └── Booking.jsx
        └── services/
            └── api.js

Local Development
Prerequisites

Python 3.11+
Node.js 18+
PostgreSQL

Backend Setup
bashcd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
Create backend/.env:
DATABASE_URL=postgresql://postgres:password@localhost:5433/caribou_resort
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
FROM_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=cariboulogcabinresort@gmail.com
FRONTEND_URL=http://localhost:5173
bashpython migrate_add_guests.py
python seed.py
uvicorn main:app --reload
Frontend Setup
bashcd frontend
npm install
Create frontend/.env:
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
bashnpm run dev

Render Deployment
PostgreSQL Database

Create a PostgreSQL instance on Render
Copy the Internal Database URL for the backend DATABASE_URL env var

Backend — Web Service
Root Directory:  backend
Build Command:   pip install -r requirements.txt
Start Command:   uvicorn main:app --host 0.0.0.0 --port $PORT
Environment variables:
DATABASE_URL              = (Render internal database URL)
STRIPE_SECRET_KEY         = sk_test_...
STRIPE_WEBHOOK_SECRET     = whsec_...
RESEND_API_KEY            = re_...
FROM_EMAIL                = onboarding@resend.dev
ADMIN_EMAIL               = cariboulogcabinresort@gmail.com
FRONTEND_URL              = https://caribou-resort1.onrender.com
PYTHON_VERSION            = 3.11.0
After first deploy, run from Render Shell:
bashpython migrate_add_guests.py
python seed.py
Frontend — Static Site
Root Directory:  frontend
Build Command:   npm install && npm run build
Publish Dir:     dist
Environment variables:
VITE_API_URL                = https://caribou-resort.onrender.com
VITE_STRIPE_PUBLISHABLE_KEY = pk_test_...

Stripe Webhook Setup

Go to dashboard.stripe.com/webhooks
Add destination → Webhook endpoint
URL: https://caribou-resort.onrender.com/payments/webhook
Event: payment_intent.succeeded
Copy the signing secret → add as STRIPE_WEBHOOK_SECRET in backend environment




Booking Rules

2-night minimum stay
Full payment required at booking
Check-in: 3:00 PM — Check-out: 11:00 AM
Maximum 5 guests per cabin
For groups larger than 5 contact us at (705)257-5434
Damage fee charged to card on file if applicable
Pets welcome
No smoking inside cabins


API Endpoints
MethodPathDescriptionGET/cabinsList all cabinsGET/cabins/{id}Cabin detailsGET/cabins/{id}/availabilityCheck date availabilityPOST/payments/create-payment-intentStart Stripe checkoutPOST/payments/webhookStripe webhook handlerPOST/admin/airbnb-bookingBlock Airbnb datesGET/admin/bookingsList all bookingsDELETE/admin/bookings/{id}Delete a booking

Contact
(705)257-5434
cariboulogcabinresort@gmail.com
239 Carter Side Rd, Desbarats, ON
