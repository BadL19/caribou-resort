# 🏕️ Caribou Log Cabin Resort

Full-stack cabin booking website for **Caribou Log Cabin Resort**, a lakeside property in Desbarats, Ontario.

🔗 Live Site: https://caribou-resort1.onrender.com

---

## 🌲 About the Resort

Three private lakeside cabins located on Caribou Lake in Desbarats, Ontario.

Enjoy:
- Fishing
- Bonfires
- Quiet nature stays

📍 Address: 239 Carter Side Rd, Desbarats, ON  
📞 Phone: (705) 257-5434  
📧 Email: cariboulogcabinresort@gmail.com  
⏱️ ~1 hour east of Sault Ste. Marie

---

## 🛠️ Tech Stack

### Frontend
- React + Vite  
- Tailwind CSS  
- Axios  
- Stripe.js  

### Backend
- FastAPI (Python)  
- PostgreSQL + SQLAlchemy  
- Stripe API  
- Resend (email service)  

### Infrastructure
- Frontend: Render Static Site → https://caribou-resort1.onrender.com  
- Backend: Render Web Service → https://caribou-resort.onrender.com  
- Database: Render PostgreSQL  

---

## ✨ Features

- Browse 3 cabins with image galleries  
- Real-time availability calendar  
- Stripe full payment integration  
- Guest limit validation (max 5 guests per cabin)  
- Email booking confirmations  
- Admin booking notifications  
- Photo gallery with lightbox viewer  
- Homepage slideshow  
- Fully mobile responsive design  
- FAQ page  
- Airbnb iCal date blocking system  

---

## 📁 Project Structure
caribou-resort/
├── README.md
├── backend/
│ ├── main.py
│ ├── database.py
│ ├── email_service.py
│ ├── seed.py
│ ├── migrate_add_guests.py
│ ├── requirements.txt
│ ├── .env.example
│ ├── models/
│ │ └── models.py
│ ├── routers/
│ │ ├── cabins.py
│ │ ├── bookings.py
│ │ ├── payments.py
│ │ └── admin.py
│ └── schemas/
│ └── schemas.py
└── frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .env.example
├── public/
│ ├── logo.png
│ ├── _redirects
│ └── images/gallery/
└── src/
├── App.jsx
├── main.jsx
├── index.css
├── components/
├── pages/
└── services/


---

##  Local Development

### Requirements
- Python 3.11+
- Node.js 18+
- PostgreSQL

---

##  Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows

pip install -r requirements.txt

Create .env

DATABASE_URL=postgresql://postgres:password@localhost:5433/caribou_resort
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
FROM_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=cariboulogcabinresort@gmail.com
FRONTEND_URL=http://localhost:5173


Run Backend
python migrate_add_guests.py
python seed.py
uvicorn main:app --reload

Frontend Setup

cd frontend
npm install
npm run dev

Create .env
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...