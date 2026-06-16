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

      <Link
        to="/#matches"
        className="font-mono text-[10px] sm:text-sm text-chalk/80 hover:text-gold transition-colors uppercase tracking-wide whitespace-nowrap"
      >
        Upcoming Matches
      </Link>
    </header>
  )
}

export default Header