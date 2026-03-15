import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import BookingCalendar from '../components/BookingCalendar'
import { getCabin } from '../services/api'
 
export default function CabinDetail() {
  const { id } = useParams()
  const [cabin, setCabin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const [dates, setDates] = useState(null)
 
  useEffect(() => {
    getCabin(id).then(d => { setCabin(d); setLoading(false) }).catch(() => setLoading(false))
  }, [id])
 
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-8 h-8 border-2 border-navy-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
 
  if (!cabin) return (
    <div className="text-center py-24 px-5">
      <h2 className="text-2xl mb-4" style={{ fontFamily: 'DM Serif Display, serif' }}>Cabin not found</h2>
      <Link to="/cabins" className="btn-dark text-sm">Back to Cabins</Link>
    </div>
  )
 
  const images = cabin.images?.length ? cabin.images : ['/images/gallery/cabin 2 exterior.jpg']
  const total = images.length
 
  const prevImg = () => setActiveImg(i => (i - 1 + total) % total)
  const nextImg = () => setActiveImg(i => (i + 1) % total)
  const prevLightbox = () => setLightbox(i => (i - 1 + total) % total)
  const nextLightbox = () => setLightbox(i => (i + 1) % total)
 
  return (
    <div className="bg-sand-50 min-h-screen">
 
      {/* Main image with arrows */}
      <div className="w-full bg-sand-200 relative overflow-hidden" style={{ height: '65vh', maxHeight: 620 }}>
        <img
          src={images[activeImg]}
          alt={cabin.name}
          className="w-full h-full object-contain cursor-pointer"
          onClick={() => setLightbox(activeImg)}
        />
 
        {/* Prev arrow */}
        {total > 1 && (
          <button
            onClick={prevImg}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/65 text-white transition-colors"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
 
        {/* Next arrow */}
        {total > 1 && (
          <button
            onClick={nextImg}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/65 text-white transition-colors"
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
 
        {/* Image counter */}
        {total > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1">
            {activeImg + 1} / {total}
          </div>
        )}
      </div>
 
      {/* Thumbnails */}
      {total > 1 && (
        <div className="flex gap-2 px-5 sm:px-8 pt-3 pb-1 overflow-x-auto max-w-7xl mx-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`shrink-0 overflow-hidden transition-all ${activeImg === i ? 'ring-2 ring-navy-600 ring-offset-1' : 'opacity-50 hover:opacity-80'}`}
            >
              <img src={img} alt="" className="h-12 w-16 object-cover" />
            </button>
          ))}
        </div>
      )}
 
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
 
        {/* Breadcrumb */}
        <div className="text-[13px] text-sand-400 mb-8 flex items-center gap-2">
          <Link to="/cabins" className="hover:text-navy-700 transition-colors">Cabins</Link>
          <span>/</span>
          <span className="text-sand-700">{cabin.name}</span>
        </div>
 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
 
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
 
            <div className="border-b border-sand-200 pb-8">
              <span className="label mb-2">
                {cabin.season === 'all_season' ? 'Available year-round' : cabin.season === 'summer' ? 'Summer cabin' : 'Winter cabin'}
              </span>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <h1 className="text-4xl sm:text-5xl" style={{ fontFamily: 'DM Serif Display, serif' }}>
                  {cabin.name}
                </h1>
                <div className="text-right">
                  <span className="block text-3xl text-navy-800" style={{ fontFamily: 'DM Serif Display, serif' }}>
                    ${cabin.price_per_night}
                  </span>
                  <span className="text-sand-400 text-sm">per night</span>
                </div>
              </div>
              <p className="text-sand-600 leading-relaxed mt-5 text-[15px]">{cabin.description}</p>
            </div>
 
            <div>
              <h3 className="text-xl mb-5" style={{ fontFamily: 'DM Serif Display, serif' }}>
                What's included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(cabin.amenities || []).map((a, i) => (
                  <div key={i} className="flex items-center gap-3 text-[14px] text-sand-700">
                    <svg className="w-3.5 h-3.5 text-navy-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {a}
                  </div>
                ))}
              </div>
            </div>
 
            <div className="bg-navy-900 p-6">
              <h3 className="text-lg mb-4 text-white" style={{ fontFamily: 'DM Serif Display, serif' }}>
                On the property
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[13px] text-white">
                {[
                  'Shared shower house with hot water',
                  'Direct lake access',
                  'Fire pit at each cabin',
                  'BBQ grill at each cabin',
                  'Firewood available $10 per crate',
                  'Outhouse on site',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-rust-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
 
          {/* Right — booking */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-sand-200 p-6 sticky top-20">
              <h3 className="text-xl mb-1" style={{ fontFamily: 'DM Serif Display, serif' }}>
                Check availability
              </h3>
              <p className="text-sand-400 text-xs mb-5">Select check-in and check-out</p>
 
              <BookingCalendar cabinId={id} onDatesSelected={setDates} />
 
              {dates && dates.nights >= 2 && (
                <div className="mt-5 space-y-3">
                  <div className="border border-sand-200 p-4 text-sm">
                    <div className="flex justify-between text-sand-600 mb-2">
                      <span>${cabin.price_per_night} &times; {dates.nights} nights</span>
                      <span>${(cabin.price_per_night * dates.nights).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-sand-900 pt-2 border-t border-sand-100">
                      <span>Total</span>
                      <span>${(cabin.price_per_night * dates.nights).toFixed(2)} CAD</span>
                    </div>
                    <p className="text-sand-400 text-[11px] mt-1.5">Full payment charged at booking</p>
                  </div>
                  <Link
                    to={`/book/${cabin.id}`}
                    state={{ dates, cabin }}
                    className="block text-center bg-navy-800 hover:bg-navy-700 text-white py-3 text-sm font-medium transition-colors"
                  >
                    Reserve Now
                  </Link>
                </div>
              )}
 
              {dates && dates.nights < 2 && (
                <p className="mt-4 text-red-600 text-sm">Minimum 2 nights required.</p>
              )}
 
              <div className="mt-5 pt-4 border-t border-sand-100 space-y-1.5 text-[12px] text-sand-400">
                <p>2-night minimum</p>
                <p>Check-in 3:00 PM &middot; Check-out 11:00 AM</p>
                <p>Free cancellation 14+ days out</p>
              </div>
            </div>
          </div>
 
        </div>
      </div>
 
      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/92 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button
            onClick={e => { e.stopPropagation(); prevLightbox() }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white text-2xl leading-none transition-colors"
          >
            &#8249;
          </button>
          <button
            onClick={e => { e.stopPropagation(); nextLightbox() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white text-2xl leading-none transition-colors"
          >
            &#8250;
          </button>
          <div className="relative inline-block" onClick={e => e.stopPropagation()}>
            <img
              src={images[lightbox]}
              alt={cabin.name}
              className="block h-auto"
              style={{ maxHeight: '85vh', maxWidth: '80vw' }}
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-black/90 text-white text-lg leading-none transition-colors"
            >
              &times;
            </button>
            <p className="text-white/40 text-xs text-center mt-2">
              {lightbox + 1} / {total}
            </p>
          </div>
        </div>
      )}
 
    </div>
  )
}