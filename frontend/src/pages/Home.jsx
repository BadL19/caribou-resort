import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import CabinCard from '../components/CabinCard'
import { getCabins } from '../services/api'

// Add your own photos here — drop them in frontend/public/images/slideshow/
// and update the src paths below to match your filenames
const SLIDES = [
  { src: '/images/gallery/lake.jpg',               alt: 'The Lake' },
  { src: '/images/gallery/cabin 5 exterior.jpg',   alt: 'Cabin 5' },
  { src: '/images/gallery/fire.jpg',               alt: 'Bonfire' },
  { src: '/images/gallery/cabin 6 exterior.jpg',   alt: 'Cabin 6' },
  { src: '/images/gallery/lake 2.jpg',             alt: 'Lake View' },
]

function Slideshow() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  const goTo = useCallback((index) => {
    setFading(true)
    setTimeout(() => {
      setCurrent(index)
      setFading(false)
    }, 300)
  }, [])

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length)
  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo])

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div className="relative w-full h-full overflow-hidden bg-navy-900">

      {/* Image */}
      <img
        src={SLIDES[current].src}
        alt={SLIDES[current].alt}
        className="w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: fading ? 0 : 1 }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-navy-950/25" />

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/30 hover:bg-black/55 text-white transition-colors"
        aria-label="Previous image"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/30 hover:bg-black/55 text-white transition-colors"
        aria-label="Next image"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="transition-all duration-300"
            aria-label={`Go to slide ${i + 1}`}
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: i === current ? 20 : 7,
                height: 7,
                background: i === current ? 'white' : 'rgba(255,255,255,0.4)',
              }}
            />
          </button>
        ))}
      </div>

    </div>
  )
}

export default function Home() {
  const [cabins, setCabins] = useState([])

  useEffect(() => {
    getCabins().then(setCabins).catch(console.error)
  }, [])

  return (
    <div className="bg-sand-50">

      {/* Hero — split layout */}
      <section className="relative h-[82vh] grid grid-cols-1 lg:grid-cols-2">

        {/* Left — text */}
        <div className="bg-navy-950 flex flex-col justify-center px-8 sm:px-14 lg:px-16 py-10 order-2 lg:order-1">
          <span className="label text-navy-400 mb-5">Desbarats, Ontario</span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Caribou<br />
            <em className="italic text-rust-400">Log Cabin</em><br />
            Resort
          </h1>
          <p className="text-navy-300 text-base leading-relaxed max-w-sm mb-10">
            Three lakeside cabins in a quiet corner of Northern Ontario.
            Fishing in the morning, bonfire in the evening.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/cabins" className="btn-rust text-[13px] px-7 py-3">
              View Cabins
            </Link>
            <Link to="/gallery" className="border border-navy-600 text-navy-300 hover:text-white hover:border-white text-[13px] px-7 py-3 transition-colors">
              See Photos
            </Link>
          </div>
          <p className="text-navy-600 text-xs mt-8">239 Carter Side Rd &mdash; Desbarats, ON</p>
        </div>

        {/* Right — slideshow */}
        <div className="order-1 lg:order-2 min-h-[50vh] lg:min-h-full">
          <Slideshow />
        </div>

      </section>

      {/* Intro strip */}
      <section className="bg-white border-b border-sand-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-sand-200">
          {[
            { num: '3',   text: 'Lakeside cabins' },
            { num: '2',   text: 'Night minimum stay' },
            { num: '$10', text: 'Per crate of firewood' },
          ].map((s, i) => (
            <div key={i} className="py-6 md:py-0 md:px-10 first:pl-0 last:pr-0">
              <span className="block text-4xl text-navy-800 mb-1" style={{ fontFamily: 'DM Serif Display, serif' }}>{s.num}</span>
              <span className="text-sm text-sand-500">{s.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <span className="label mb-4">About the resort</span>
          <h2 className="text-4xl lg:text-5xl mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>
            A good place<br />
            <em className="italic text-navy-600">to slow down.</em>
          </h2>
          <div className="space-y-4 text-sand-600 leading-relaxed">
            <p>
              Caribou Log Cabin Resort sits on a quiet stretch of shoreline on Caribou Lake in Desbarats,
              Ontario. Three cabins and a shared shower house.
            </p>
            <p>
              The fishing is the main draw. bass, pickerel and catfish are all here. Spend
              your mornings on the water and your evenings around your own fire pit
              each cabin has one, right at the waterline.
            </p>
            <p>
              We have options ranging from a fully equipped cabin with a kitchen and
              bathroom to simpler, more rustic stays. Whatever you're after, the lake
              and the quiet are always part of the deal.
            </p>
          </div>
          <Link to="/cabins" className="btn-outline mt-8 inline-block text-[13px]">
            See all three cabins
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <img
            src='/images/gallery/fire.jpg'
            alt="Bonfire"
            className="w-full object-cover"
            style={{ aspectRatio: '3/4' }}
          />
          <div className="flex flex-col gap-3">
            <img
              src='/images/gallery/lake.jpg'
              alt="Lake"
              className="w-full object-cover flex-1"
              style={{ aspectRatio: '4/3' }}
            />
            <div className="bg-navy-900 p-5 flex-1">
              <p className="text-navy-300 text-sm leading-relaxed italic" style={{ fontFamily: 'DM Serif Display, serif' }}>
                "Nights quiet enough to actually unwind."
              </p>
            </div>
          </div>
        </div>
      </section>

      

      {/* Three column features */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-sand-200">
        {[
          {
            img: '/images/gallery/fish 8.jpg',
            title: 'Fishing on the Lake',
            body: 'bass, pickerel and catfish. Cast from shore or head out on the water. The lake is right there.',
          },
          {
            img: '/images/gallery/fire.jpg',
            title: 'Bonfires with a View',
            body: 'Every cabin has its own fire pit on the water. Firewood available on site — $10 per milk crate.',
          },
          {
            img: '/images/gallery/stars.jpg',
            title: 'Quiet Nights',
            body: "Away from city lights and city noise. The kind of quiet that's hard to find.",
          },
        ].map((f, i) => (
          <div key={i} className="bg-white">
            <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <img src={f.img} alt={f.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-xl mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>{f.title}</h3>
              <p className="text-sand-500 text-sm leading-relaxed">{f.body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA banner */}
      <section className="relative py-24 overflow-hidden">
        <img
          src='/images/gallery/lake.jpg'
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/78" />
        <div className="relative z-10 max-w-2xl mx-auto text-center px-5">
          <h2 className="text-4xl sm:text-5xl text-white mb-4" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Ready to book?
          </h2>
          <p className="text-black mb-8 text-base">
            Summer weekends fill up fast. Minimum 2-night stay.
          </p>
          <Link to="/cabins" className="btn-rust inline-block text-sm px-10 py-3.5">
            Browse Cabins
          </Link>
        </div>
      </section>

    </div>
  )
}