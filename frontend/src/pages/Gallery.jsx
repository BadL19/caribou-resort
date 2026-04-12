import { useState } from 'react'
import { Link } from 'react-router-dom'

const photos = [
  { url: '/images/gallery/cabin 2 exterior.jpg',      caption: 'Cabin 2 — Exterior' },
  { url: '/images/gallery/cabin 2 kitchen.jpg',       caption: 'Cabin 2 — Kitchen' },
  { url: '/images/gallery/cabin 2 living room.jpg',   caption: 'Cabin 2 — Living Room' },
  { url: '/images/gallery/cabin 5 exterior.jpg',      caption: 'Cabin 5 — Exterior' },
  { url: '/images/gallery/cabin 5 bed 1.jpg',         caption: 'Cabin 5 — Bedroom 1' },
  { url: '/images/gallery/cabin 5 bed 2.jpg',         caption: 'Cabin 5 — Bedroom 2' },
  { url: '/images/gallery/cabin 5 bed 3.jpg',         caption: 'Cabin 5 — Bedroom 3' },
  { url: '/images/gallery/cabin 5 deck 2.jpg',        caption: 'Cabin 5 — Deck' },
  { url: '/images/gallery/cabin 5 deck.jpg',          caption: 'Cabin 5 — Deck' },
  { url: '/images/gallery/cabin 5 kitchen.jpg',       caption: 'Cabin 5 — Kitchen' },
  { url: '/images/gallery/cabin 5 living room.jpg',   caption: 'Cabin 5 — Living Room' },
  { url: '/images/gallery/cabin 5 living room 2.jpg', caption: 'Cabin 5 — Living Room' },
  { url: '/images/gallery/cabin 6 exterior.jpg',      caption: 'Cabin 6 — Exterior' },
  { url: '/images/gallery/cabin 6 outside.jpg',       caption: 'Cabin 6 — Outside' },
  { url: '/images/gallery/cabin 6 bed 1.jpg',         caption: 'Cabin 6 — Bedroom 1' },
  { url: '/images/gallery/cabin 6 bed 2.jpg',         caption: 'Cabin 6 — Bedroom 2' },
  { url: '/images/gallery/cabin 6 kitchen.jpg',       caption: 'Cabin 6 — Kitchen' },
  { url: '/images/gallery/cabin 6 kitchen 2.jpg',     caption: 'Cabin 6 — Kitchen' },
  { url: '/images/gallery/cabin 6 living room.jpg',   caption: 'Cabin 6 — Living Room' },
  { url: '/images/gallery/lake.jpg',                  caption: 'The Lake' },
  { url: '/images/gallery/lake 2.jpg',                caption: 'Lake View' },
  { url: '/images/gallery/lake 3.jpg',                caption: 'Lake View' },
  { url: '/images/gallery/winter lake.jpg',           caption: 'Winter on the Lake' },
  { url: '/images/gallery/rainbow.jpg',               caption: 'Rainbow over the Lake' },
  { url: '/images/gallery/fish.jpg',                  caption: 'Fishing' },
  { url: '/images/gallery/fish5.jpg',                caption: 'Fishing' },
  { url: '/images/gallery/fish 6.jpg',                caption: 'Fishing' },
  { url: '/images/gallery/fish 7.jpg',                caption: 'Fishing' },
  { url: '/images/gallery/fish 8.jpg',                caption: 'Fishing' },
  { url: '/images/gallery/fire.jpg',                  caption: 'Bonfire' },
  { url: '/images/gallery/shower house 1.jpg',        caption: 'Shower House' },
  { url: '/images/gallery/shower house 2.jpg',        caption: 'Shower House' },
]

export default function Gallery() {


  return (
    <div className="bg-sand-50 min-h-screen">

      <div className="bg-navy-950 pt-14 pb-12 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="label text-navy-400 mb-4">Photos</span>
          <h1 className="text-5xl text-white" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Gallery
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="break-inside-avoid cursor-pointer overflow-hidden group"
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link to="/cabins" className="btn-dark text-sm px-8 py-3">
            Book a Cabin
          </Link>
        </div>
      </div>
    </div>
  )
}