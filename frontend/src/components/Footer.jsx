import { Link } from 'react-router-dom'
 
const MAPS_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2752.4806815453667!2d-83.84821172323258!3d46.37969057189183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4d36f36d7d30ce31%3A0x9c934b2004ff820a!2s239%20Carter%20Side%20Rd%2C%20Bruce%20Mines%2C%20ON%20P0R%201C0%2C%20Canada!5e0!3m2!1sen!2sus!4v1773515654275!5m2!1sen!2sus'
const MAPS_LINK = 'https://maps.google.com/?q=239+Carter+Side+Rd,+Desbarats,+ON'
 
const navLinks = [
  { to: '/',        label: 'Home' },
  { to: '/cabins',  label: 'Cabins' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/faq',     label: 'FAQ' },
]
 
export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-navy-950 text-navy-300">
 
      {/* Map section */}
      <div className="border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <span className="label text-navy-500 mb-4">Location</span>
            <h3 className="text-3xl text-white mb-3" style={{ fontFamily: 'DM Serif Display, serif' }}>
              239 Carter Side Rd<br />Desbarats, Ontario
            </h3>
            <p className="text-navy-400 text-sm leading-relaxed mb-5 max-w-xs">
              On Caribou Lake. About 1 hour east of Sault Ste. Marie.
            </p>
            <a href={MAPS_LINK} target="_blank" rel="noreferrer"
              className="inline-block text-[13px] font-medium border border-navy-600 hover:border-white text-navy-300 hover:text-white px-5 py-2.5 transition-colors">
              Open in Google Maps
            </a>
          </div>
          <div className="h-60 lg:h-72 border border-navy-800">
            <iframe
              src={MAPS_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Caribou Log Cabin Resort"
            />
          </div>
        </div>
      </div>
 
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
 
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <img src="/logo.png" alt="" className="w-7 h-7 rounded opacity-80" />
            <span className="text-white text-sm font-medium" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Caribou Log Cabin Resort
            </span>
          </div>
          <p className="text-navy-500 text-sm leading-relaxed">
            Three lakeside cabins on Caribou Lake.
            Desbarats, Ontario.
          </p>
        </div>
 
        <div>
          <h4 className="text-[11px] font-medium tracking-[0.2em] uppercase text-navy-500 mb-4">Pages</h4>
          <ul className="space-y-2">
            {navLinks.map(l => (
              <li key={l.label}>
                <Link to={l.to} className="text-navy-400 hover:text-white text-sm transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
 
        <div>
          <h4 className="text-[11px] font-medium tracking-[0.2em] uppercase text-navy-500 mb-4">Contact</h4>
          <div className="space-y-2 text-sm">
            <p className="text-navy-400">239 Carter Side Rd, Desbarats, ON</p>
            <a href="cariboulogcabinresort@gmail.com" className="block text-navy-400 hover:text-white transition-colors">
              cariboulogcabinresort@gmail.com
            </a>
            <a href="tel:+17052575434" className="block text-navy-400 hover:text-white transition-colors">
              (705) 257-5434
            </a>
          </div>
          <div className="mt-5 pt-4 border-t border-navy-800 text-[12px] text-navy-600 space-y-1">
            <p>Check-in 3:00 PM &middot; Check-out 11:00 AM</p>
            <p>2-night minimum stay</p>
          </div>
        </div>
      </div>
 
      <div className="border-t border-navy-900 max-w-7xl mx-auto px-5 sm:px-8 py-5 flex justify-between items-center">
        <p className="text-navy-700 text-xs">&copy; {year} Caribou Log Cabin Resort</p>
      </div>
    </footer>
  )
}
 