"""Seed the database with the 4 real cabins."""
from database import SessionLocal, engine, Base
from models.models import Cabin

Base.metadata.create_all(bind=engine)

cabins_data = [
    {
        "name": "Honeymoon Cabin",
        "season": "summer",
        "description": "A cozy open cabin made for couples. The Honeymoon Cabin has one bedroom, a kitchen, and its own fire pit right on the water. No running water but the shared shower house is on the property and there is an outhouse on site. A quiet, private spot perfect for two.",
        "short_description": "Cozy and private. Perfect for couples with a fire pit right on the water.",
        "price_per_night": 100.00,
        "amenities": [
            "One bedroom",
            "Kitchen",
            "Private fire pit",
            "BBQ grill",
            "Firewood available ($10 per crate)",
            "Propane available ($30 per tank)",
            "Outhouse on site",
            "Access to shared shower house",
            "Lake access",
        ],
        "images": [
            "/images/gallery/honeymoon_ext.jpg",
            "/images/gallery/honeymoon_ext2.jpg",
            "/images/gallery/honeymoon_kitchen.jpg",
            "/images/gallery/honeymoon_bed.jpg",
        ],
        "max_guests": 2,
        "bedrooms": 1,
    },
    {
        "name": "Cabin 2",
        "season": "all_season",
        "description": "Our largest cabin on the property. Cabin 2 has a loft, a full kitchen, a full bathroom, and a comfortable living area. Plenty of space for a group or family. Has its own fire pit and BBQ right on the property with direct access to the lake.",
        "short_description": "Our largest cabin. Loft, full kitchen and full bathroom.",
        "price_per_night": 200.00,
        "amenities": [
            "Loft",
            "Full kitchen",
            "Full bathroom",
            "Living area",
            "Private fire pit",
            "BBQ grill",
            "Firewood available ($10 per crate)",
            "Propane available ($30 per tank)",
            "Lake access",
        ],
        "images": [
            "/images/gallery/cabin 2 exterior.jpg",
            "/images/gallery/cabin 2 kitchen.jpg",
            "/images/gallery/cabin 2 living room.jpg",
        ],
        "max_guests": 6,
        "bedrooms": 2,
    },
    {
        "name": "Cabin 5",
        "season": "summer",
        "description": "A spacious cabin with three separate bedrooms, a full kitchen, a deck, and a large living area. Great for families or a group of friends. No running water but the shared shower house is nearby and there is an outhouse on site.",
        "short_description": "Three bedrooms, full kitchen, and a deck. Great for families or groups.",
        "price_per_night": 140.00,
        "amenities": [
            "3 separate bedrooms",
            "Full kitchen",
            "Large deck",
            "Living area",
            "Private fire pit",
            "BBQ grill",
            "Firewood available ($10 per crate)",
            "Propane available ($30 per tank)",
            "Outhouse on site",
            "Access to shared shower house",
            "Lake access",
        ],
        "images": [
            "/images/gallery/cabin 5 exterior.jpg",
            "/images/gallery/cabin 5 bed 1.jpg",
            "/images/gallery/cabin 5 bed 2.jpg",
            "/images/gallery/cabin 5 bed 3.jpg",
            "/images/gallery/cabin 5 kitchen.jpg",
            "/images/gallery/cabin 5 living room.jpg",
            "/images/gallery/cabin 5 living room 2.jpg",
            "/images/gallery/cabin 5 deck.jpg",
            "/images/gallery/cabin 5 deck 2.jpg",
        ],
        "max_guests": 6,
        "bedrooms": 3,
    },
    {
        "name": "Cabin 6",
        "season": "all_season",
        "description": "A comfortable cabin with a loft, two bedrooms, a kitchen, and a living area. No running water, outhouse on site, and the shared shower house is on the property. Great fire pit spot and a BBQ for evenings outside.",
        "short_description": "Loft, two bedrooms and a kitchen. A comfortable stay close to the water.",
        "price_per_night": 140.00,
        "amenities": [
            "Loft",
            "2 bedrooms",
            "Kitchen",
            "Living area",
            "Private fire pit",
            "BBQ grill",
            "Firewood available ($10 per crate)",
            "Propane available ($30 per tank)",
            "Outhouse on site",
            "Access to shared shower house",
            "Lake access",
        ],
        "images": [
            "/images/gallery/cabin 6 exterior.jpg",
            "/images/gallery/cabin 6 bed 1.jpg",
            "/images/gallery/cabin 6 bed 2.jpg",
            "/images/gallery/cabin 6 kitchen.jpg",
            "/images/gallery/cabin 6 kitchen 2.jpg",
            "/images/gallery/cabin 6 living room.jpg",
            "/images/gallery/cabin 6 outside.jpg",
        ],
        "max_guests": 6,
        "bedrooms": 2,
    },
]


def seed():
    db = SessionLocal()
    try:
        existing = db.query(Cabin).count()
        if existing > 0:
            print(f"Database already has {existing} cabins. Skipping seed.")
            print("To re-seed: DELETE FROM bookings; DELETE FROM cabins; then run again.")
            return
        for data in cabins_data:
            cabin = Cabin(**data)
            db.add(cabin)
        db.commit()
        print(f"Seeded {len(cabins_data)} cabins successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()