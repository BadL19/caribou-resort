import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
 
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
 
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
 
  const links = [
    { to: '/',        label: 'Home',    end: true },
    { to: '/cabins',  label: 'Cabins',  end: false },
    { to: '/gallery', label: 'Gallery', end: false },
    { to: '/faq',     label: 'FAQ',     end: false },
  ]
 
  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-navy-950 shadow-md' : 'bg-navy-950'}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[60px]">
 
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="w-7 h-7 rounded" />
            <div>
              <span className="block text-white font-semibold text-[13px] leading-none" style={{ fontFamily: 'DM Serif Display, serif' }}>
                Caribou Log Cabin Resort
              </span>
              <span className="block text-navy-400 text-[10px] tracking-[0.2em] uppercase leading-none mt-0.5">
                Desbarats, Ontario
              </span>
            </div>
          </Link>
 
          <nav className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.end}
                className={({ isActive }) =>
                  `text-[13px] font-medium transition-colors ${isActive ? 'text-white' : 'text-navy-300 hover:text-white'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/cabins" className="ml-2 bg-rust-600 hover:bg-rust-500 text-white text-[13px] font-medium px-4 py-2 transition-colors">
              Book Now
            </Link>
          </nav>
 
          <button
            className="md:hidden text-navy-300 hover:text-white p-1"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
 
        {open && (
          <div className="md:hidden border-t border-navy-800 py-3 space-y-0.5 pb-4">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-2 py-2 text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-navy-300 hover:text-white'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/cabins" onClick={() => setOpen(false)}
              className="block mt-2 bg-rust-600 hover:bg-rust-500 text-white text-sm font-medium px-4 py-2.5 text-center transition-colors">
              Book Now
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
 