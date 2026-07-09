import { convertETtoSaudi } from '../utils/timezones'

function Side({ team, align }) {
  const justify = align === 'right' ? 'justify-end' : ''
  if (!team) {
    return (
      <div className={`flex items-center gap-2 flex-1 min-w-0 ${justify}`}>
        <span className="font-mono text-xs text-navy/40 italic">TBD</span>
      </div>
    )
  }
  const flag = (
    <img
      src={`https://flagcdn.com/w80/${team.flagCode}.png`}
      alt={`${team.name} flag`}
      className="w-6 h-4 sm:w-7 sm:h-5 object-cover rounded-sm flex-shrink-0"
    />
  )
  const name = (
    <span className="font-display text-sm sm:text-lg text-navy truncate">{team.name}</span>
  )
  return (
    <div className={`flex items-center gap-2 sm:gap-3 flex-1 min-w-0 ${justify}`}>
      {align === 'right' ? (
        <>
          {name}
          {flag}
        </>
      ) : (
        <>
          {flag}
          {name}
        </>
      )}
    </div>
  )
}

function KnockoutRow({ fixture, teams, stadiums }) {
  const team1 = fixture.team1 ? teams.find((t) => t.id === fixture.team1) : null
  const team2 = fixture.team2 ? teams.find((t) => t.id === fixture.team2) : null
  const stadium = stadiums.find((s) => s.id === fixture.stadium)

  const saudiTime = fixture.time ? convertETtoSaudi(fixture.time) : null
  const timeOrStatus = fixture.played ? 'FT' : saudiTime || fixture.time || ''

  return (
    <div className="border-b border-navy/10 last:border-b-0">
      <div className="px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] uppercase tracking-wide text-pitch">
            {fixture.roundLabel}
          </span>
          <span className="font-mono text-xs text-navy/40 truncate max-w-[140px]">
            {stadium?.city}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-mono text-xs text-navy/50 w-12 sm:w-20 flex-shrink-0">
            {timeOrStatus}
          </span>

          <Side team={team1} align="right" />

          <div className="px-2 sm:px-5 font-display text-sm sm:text-xl text-navy text-center flex-shrink-0 whitespace-nowrap">
            {fixture.score || 'vs'}
          </div>

          <Side team={team2} align="left" />
        </div>
      </div>
    </div>
  )
}

export default KnockoutRow