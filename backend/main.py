from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import cabins, bookings, payments
from routers.ical import router as calendar_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Caribou Log Cabin Resort API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://caribou-sooty.vercel.app",
        "https://cariboulogcabinresort.ca",
        "https://www.cariboulogcabinresort.ca",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cabins.router)
app.include_router(bookings.router)
app.include_router(payments.router)
app.include_router(calendar_router)


@app.get("/")
def root():
    return {"message": "Caribou Log Cabin Resort API"}