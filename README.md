# 🌲 Caribou Log Cabin Resort

Full-stack cabin booking website — React (Vite) + Tailwind frontend, FastAPI + PostgreSQL backend.

---

## 🏕️ Cabins

| Cabin | Season | Price/Night |
|-------|--------|-------------|
| Electric Heat Cabin | Winter | $145 |
| Rustic Winter Cabin | Winter | $95 |
| Rustic Summer Cabin 1 | Summer | $75 |
| Rustic Summer Cabin 2 | Summer | $75 |

---

## 🚀 Quick Start

### 1. Create the PostgreSQL database

Open pgAdmin → right-click Databases → Create → Database → name it `caribou_resort`

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then fill in your values
uvicorn main:app --reload       # auto-creates all tables on first run
python seed.py                  # seed the 4 cabins
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env            # add your Stripe publishable key
npm run dev
```

---

## ⚙️ Environment Variables

### `backend/.env`

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost/caribou_resort

# Stripe — https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend email — https://resend.com
RESEND_API_KEY=re_...
FROM_EMAIL=reservations@cariboulogcabin.ca
ADMIN_EMAIL=admin@cariboulogcabin.ca

FRONTEND_URL=http://localhost:5173
```

### `frontend/.env`

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:8000
```

---

## 💳 Stripe Setup

1. Create a free account at [stripe.com](https://stripe.com)
2. Go to **Developers → API Keys** and copy your test keys
3. Add `sk_test_...` to `backend/.env` and `pk_test_...` to `frontend/.env`
4. For webhooks (to auto-confirm bookings + send emails):
   - Install Stripe CLI: `stripe login`
   - Forward events: `stripe listen --forward-to localhost:8000/payments/webhook`
   - Copy the webhook secret (`whsec_...`) to `backend/.env`

The booking flow charges a **50% deposit** via Stripe. The remaining balance is collected at check-in.

---

## 📧 Email Setup (Resend)

1. Create a free account at [resend.com](https://resend.com)
2. Add and verify your domain (or use `onboarding@resend.dev` for testing)
3. Create an API key and add it to `backend/.env`

Emails sent automatically:
- **Guest confirmation** — booking details, deposit receipt, check-in info
- **Admin notification** — new booking summary

---

## 📍 Google Maps (Footer)

The footer embeds an iframe map showing Northern Ontario. To update it to your exact location:

1. Go to [google.com/maps](https://maps.google.com) and find your property
2. Click **Share → Embed a map** → copy the `src="..."` URL
3. Update `MAPS_EMBED_URL` and `MAPS_LINK` at the top of `frontend/src/components/Footer.jsx`

No API key required for the basic embed.

---

## 📷 Replacing Placeholder Images

Drop your real photos into these folders (same filenames = auto-replaced):

```
frontend/public/images/cabins/
  cabin1_main.jpg      ← Electric Heat Cabin main photo
  cabin1_kitchen.jpg   ← kitchen interior
  cabin1_beds.jpg      ← bedroom
  cabin2_main.jpg      ← Rustic Winter Cabin main
  cabin2_stove.jpg     ← pellet stove
  cabin2_ext.jpg       ← exterior
  cabin3_main.jpg      ← Rustic Summer Cabin 1 main
  cabin3_porch.jpg     ← porch
  cabin3_view.jpg      ← forest view
  cabin4_main.jpg      ← Rustic Summer Cabin 2 main
  cabin4_fire.jpg      ← fire pit
  cabin4_view.jpg      ← woodland view

frontend/public/images/gallery/
  aerial.jpg  winter1.jpg  summer1.jpg  campfire.jpg  stars.jpg
  lake.jpg    moose.jpg    snowshoe.jpg fishing.jpg   kitchen.jpg
  showerhouse.jpg  trail.jpg  birch.jpg  fog.jpg  sunset.jpg
```

No code changes needed — just replace the files.

---

## 🌐 Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Hero, resort intro, featured cabins, CTA |
| Cabins | `/cabins` | All 4 cabins, season filter |
| Cabin Detail | `/cabins/:id` | Gallery, amenities, availability calendar |
| Gallery | `/gallery` | Masonry grid with category filter + lightbox |
| FAQ | `/faq` | Accordion FAQ (15+ questions) |
| Booking | `/book/:id` | 3-step: Details → Stripe Payment → Confirmed |
| Admin | `/admin` | All bookings, delete, add Airbnb blocks |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cabins` | List all cabins |
| GET | `/cabins/{id}` | Cabin details |
| GET | `/cabins/{id}/bookings` | Cabin's bookings |
| GET | `/cabins/{id}/availability` | Check date availability |
| POST | `/bookings` | Direct booking (no payment) |
| POST | `/payments/create-payment-intent` | Start Stripe checkout |
| POST | `/payments/webhook` | Stripe webhook handler |
| GET | `/admin/bookings` | All bookings |
| POST | `/admin/airbnb-booking` | Block Airbnb dates |
| DELETE | `/admin/bookings/{id}` | Delete booking |
| POST | `/admin/sync-ical/{id}` | Sync Airbnb iCal feed |

---

## 📁 Project Structure

```
caribou-resort/
├── backend/
│   ├── main.py              # FastAPI app, CORS, router registration
│   ├── database.py          # SQLAlchemy engine + session
│   ├── email_service.py     # Resend email confirmation
│   ├── seed.py              # Cabin seed data
│   ├── models/models.py     # Cabin + Booking SQLAlchemy models
│   ├── routers/
│   │   ├── cabins.py        # GET /cabins, /cabins/{id}, availability
│   │   ├── bookings.py      # POST /bookings (direct, no payment)
│   │   ├── payments.py      # Stripe PaymentIntent + webhook
│   │   └── admin.py         # Admin dashboard endpoints
│   ├── schemas/schemas.py   # Pydantic request/response models
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── public/
    │   ├── favicon.svg               # Pine tree + cabin icon
    │   └── images/
    │       ├── cabins/               # 12 cabin placeholder images
    │       └── gallery/              # 15 gallery placeholder images
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx            # Includes Google Maps embed
        │   ├── CabinCard.jsx
        │   └── BookingCalendar.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Cabins.jsx
        │   ├── CabinDetail.jsx
        │   ├── Gallery.jsx           # Local images + category filter
        │   ├── FAQ.jsx
        │   ├── Booking.jsx           # 3-step Stripe checkout
        │   └── AdminDashboard.jsx
        ├── services/api.js
        └── App.jsx
```
