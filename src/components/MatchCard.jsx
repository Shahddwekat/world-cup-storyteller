import { Link } from 'react-router-dom'
import { findFinalScore } from '../utils/matchResults'
import { convertETtoSaudi } from '../utils/timezones'

function MatchCard({ match, teams, stadiums, results }) {
  const home = teams.find((t) => t.id === match.homeTeam)
  const away = teams.find((t) => t.id === match.awayTeam)
  const stadium = stadiums.find((s) => s.id === match.stadium)

  const dateLabel = new Date(match.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  const score = findFinalScore(results, {
    homeTeamId: match.homeTeam,
    homeTeamName: home.name,
    awayTeamId: match.awayTeam,
    awayTeamName: away.name,
    date: match.date,
  })

  const saudiTime = convertETtoSaudi(match.time)

  return (
    <Link
      to={`/match/${match.id}`}
      className="bg-chalk rounded-2xl overflow-hidden shadow-lg flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
    >
      <div className="flex items-center justify-between px-5 pt-4">
        <span className="bg-pitch text-chalk text-xs font-mono font-semibold px-3 py-1 rounded-full">
          Group {match.group}
        </span>
        {score ? (
          <span className="bg-navy text-gold text-xs font-mono font-semibold px-3 py-1 rounded-full">
            FT
          </span>
        ) : (
          <span className="font-mono text-xs text-navy/60 text-right leading-tight">
            {dateLabel}
            <br />
            {match.time}
            {saudiTime ? ` · ${saudiTime}` : ''}
          </span>
        )}
      </div>

      <div className="flex items-center justify-center gap-6 py-8">
        <div className="flex flex-col items-center gap-2 w-24">
          <img
            src={`https://flagcdn.com/w80/${home.flagCode}.png`}
            alt={`${home.name} flag`}
            className="w-12 h-8 object-cover rounded shadow"
          />
          <span className="font-display text-lg text-navy text-center leading-none">
            {home.name}
          </span>
          {score && (
            <span className="font-display text-2xl text-navy">{score.homeScore}</span>
          )}
        </div>

        <span className="font-display text-gold text-2xl">VS</span>

        <div className="flex flex-col items-center gap-2 w-24">
          <img
            src={`https://flagcdn.com/w80/${away.flagCode}.png`}
            alt={`${away.name} flag`}
            className="w-12 h-8 object-cover rounded shadow"
          />
          <span className="font-display text-lg text-navy text-center leading-none">
            {away.name}
          </span>
          {score && (
            <span className="font-display text-2xl text-navy">{score.awayScore}</span>
          )}
        </div>
      </div>

      <div className="border-t border-dashed border-navy/20 px-5 py-3 bg-navy/5">
        <p className="font-body text-sm text-navy/70">
          {stadium.name} — {stadium.city}
        </p>
      </div>
    </Link>
  )
}

export default MatchCard