import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-navy border-b border-gold/20 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
      <Link
        to="/"
        className="font-display text-lg sm:text-2xl text-gold tracking-wide flex items-center gap-2 whitespace-nowrap"
      >
        ⚽ World Cup Storyteller
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