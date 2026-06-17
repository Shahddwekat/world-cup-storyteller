import { Link } from 'react-router-dom'
import { findFinalScore } from '../utils/matchResults'
import { convertETtoSaudi } from '../utils/timezones'

function MatchRow({ match, teams, stadiums, results }) {
  const home = teams.find((t) => t.id === match.homeTeam)
  const away = teams.find((t) => t.id === match.awayTeam)
  const stadium = stadiums.find((s) => s.id === match.stadium)

  const score = findFinalScore(results, {
    homeTeamId: match.homeTeam,
    homeTeamName: home.name,
    awayTeamId: match.awayTeam,
    awayTeamName: away.name,
    date: match.date,
  })

  const saudiTime = convertETtoSaudi(match.time)
  const timeOrStatus = score ? 'FT' : saudiTime || match.time

  return (
    <Link
      to={`/match/${match.id}`}
      className="block hover:bg-navy/5 transition-colors border-b border-navy/10 last:border-b-0"
    >
      {/* Mobile layout */}
      <div className="sm:hidden px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-navy/50">{timeOrStatus}</span>
          <span className="font-mono text-xs text-navy/40 truncate max-w-[120px]">
            {stadium?.city}
          </span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 flex-1 justify-end min-w-0">
            <span className="font-display text-sm text-navy truncate">{home.name}</span>
            <img
              src={`https://flagcdn.com/w80/${home.flagCode}.png`}
              alt={`${home.name} flag`}
              className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
            />
          </div>
          <span className="font-display text-base text-navy flex-shrink-0">
            {score ? `${score.homeScore}-${score.awayScore}` : 'vs'}
          </span>
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <img
              src={`https://flagcdn.com/w80/${away.flagCode}.png`}
              alt={`${away.name} flag`}
              className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
            />
            <span className="font-display text-sm text-navy truncate">{away.name}</span>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:flex items-center px-6 py-5">
        <span className="font-mono text-xs text-navy/50 w-20 flex-shrink-0">{timeOrStatus}</span>

        <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
          <span className="font-display text-lg text-navy truncate">{home.name}</span>
          <img
            src={`https://flagcdn.com/w80/${home.flagCode}.png`}
            alt={`${home.name} flag`}
            className="w-7 h-5 object-cover rounded-sm flex-shrink-0"
          />
        </div>

        <div className="px-5 font-display text-xl text-navy w-20 text-center flex-shrink-0">
          {score ? `${score.homeScore} - ${score.awayScore}` : 'vs'}
        </div>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={`https://flagcdn.com/w80/${away.flagCode}.png`}
            alt={`${away.name} flag`}
            className="w-7 h-5 object-cover rounded-sm flex-shrink-0"
          />
          <span className="font-display text-lg text-navy truncate">{away.name}</span>
        </div>

        <span className="font-mono text-xs text-navy/40 w-28 text-right flex-shrink-0 truncate">
          {stadium?.city}
        </span>
      </div>
    </Link>
  )
}

export default MatchRow