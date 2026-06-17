import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-navy border-b border-gold/20 px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-3">
      <Link to="/" className="flex items-center flex-shrink-0">
        <img src={logo} alt="World Cup Storyteller" className="h-10 sm:h-14 w-auto" />
      </Link>

      <nav className="flex items-center gap-3 sm:gap-5 overflow-x-auto">
        <Link
          to="/schedule"
          className="font-mono text-[10px] sm:text-sm text-chalk/80 hover:text-gold transition-colors uppercase tracking-wide whitespace-nowrap"
        >
          Schedule
        </Link>
        <Link
          to="/standings"
          className="font-mono text-[10px] sm:text-sm text-chalk/80 hover:text-gold transition-colors uppercase tracking-wide whitespace-nowrap"
        >
          Standings
        </Link>
        <Link
          to="/scorers"
          className="font-mono text-[10px] sm:text-sm text-chalk/80 hover:text-gold transition-colors uppercase tracking-wide whitespace-nowrap"
        >
          Scorers
        </Link>
        <Link
          to="/knockout"
          className="font-mono text-[10px] sm:text-sm text-chalk/80 hover:text-gold transition-colors uppercase tracking-wide whitespace-nowrap"
        >
          Bracket
        </Link>
      </nav>
    </header>
  )
}

export default Header