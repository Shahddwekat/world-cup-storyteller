import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'

const NAV_LINKS = [
  { to: '/schedule', label: 'Schedule' },
  { to: '/standings', label: 'Standings' },
  { to: '/scorers', label: 'Scorers' },
  { to: '/history', label: 'History' },
  { to: '/knockout', label: 'Bracket' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-navy border-b border-gold/20">
      <div className="px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-3 min-h-[72px] sm:min-h-[96px]">
        <Link to="/" className="flex items-center flex-shrink-0" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="World Cup Storyteller" className="h-14 sm:h-20 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `group relative font-mono text-xs uppercase tracking-wide whitespace-nowrap py-1 transition-colors ${
                  isActive ? 'text-gold' : 'text-chalk/80 hover:text-gold'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute left-0 -bottom-1 w-full h-[2px] bg-gold transition-transform duration-200 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-chalk/80 hover:text-gold flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="md:hidden bg-navy border-t border-gold/20 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `font-mono text-sm uppercase tracking-wide transition-colors ${
                  isActive ? 'text-gold' : 'text-chalk/80 hover:text-gold'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}

export default Header