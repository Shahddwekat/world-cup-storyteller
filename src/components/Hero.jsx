import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'

const NAV_LINKS = [
  { to: '/schedule', label: 'Schedule' },
  { to: '/standings', label: 'Standings' },
  { to: '/scorers', label: 'Scorers' },
  { to: '/knockout', label: 'Bracket' },
]

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-navy border-b border-gold/20 px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-3 min-h-[88px] sm:min-h-[112px]">
      <Link to="/" className="flex items-center flex-shrink-0">
        <img src={logo} alt="World Cup Storyteller" className="h-16 sm:h-24 w-auto" />
      </Link>

      <nav className="flex items-center gap-3 sm:gap-6 overflow-x-auto">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `group relative font-mono text-[10px] sm:text-sm uppercase tracking-wide whitespace-nowrap py-1 transition-colors ${
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
    </header>
  )
}

export default Header