import teams from '../data/teams.json'
import stadiums from '../data/stadiums.json'
import { getUpcomingFixtures } from '../utils/fixtures'
import { getToday } from '../utils/today'
import { convertETtoSaudi } from '../utils/timezones'

const teamById = Object.fromEntries(teams.map((t) => [t.id, t]))
const stadiumById = Object.fromEntries(stadiums.map((s) => [s.id, s]))

function dayLabel(dateStr, today) {
  if (dateStr === today) return 'Today'
  const d = new Date(dateStr + 'T00:00:00')
  const t = new Date(today + 'T00:00:00')
  const diff = Math.round((d - t) / 86400000)
  if (diff === 1) return 'Tomorrow'
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function TeamChip({ id }) {
  const team = id ? teamById[id] : null
  if (!team) return <span className="font-mono text-xs text-chalk/40 italic">TBD</span>
  return (
    <span className="flex items-center gap-1.5 min-w-0">
      <img
        src={`https://flagcdn.com/w40/${team.flagCode}.png`}
        alt={`${team.name} flag`}
        className="w-5 h-3.5 object-cover rounded-sm flex-shrink-0"
      />
      <span className="font-display text-sm text-chalk truncate">{team.name}</span>
    </span>
  )
}

function UpcomingMatches({ limit = 4 }) {
  const today = getToday()
  const fixtures = getUpcomingFixtures(today, limit)

  if (fixtures.length === 0) return null

  return (
    <section className="bg-navy rounded-2xl px-5 py-6 mb-10">
      <p className="font-mono text-xs text-gold uppercase tracking-[0.2em] mb-5">Coming Up</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fixtures.map((f) => {
          const stadium = f.stadium ? stadiumById[f.stadium] : null
          const time = f.time ? convertETtoSaudi(f.time) || f.time : null
          return (
            <div key={f.id} className="bg-chalk/5 border border-chalk/10 rounded-xl px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-wide text-gold/80">
                  {f.roundLabel}
                </span>
                <span className="font-mono text-[10px] text-chalk/50">
                  {dayLabel(f.date, today)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <TeamChip id={f.kind === 'group' ? f.homeTeam : f.team1} />
                <span className="font-mono text-[10px] text-chalk/40 flex-shrink-0">vs</span>
                <TeamChip id={f.kind === 'group' ? f.awayTeam : f.team2} />
              </div>

              <p className="font-mono text-[10px] text-chalk/40 mt-2 truncate">
                {[time, stadium?.city].filter(Boolean).join(' · ')}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default UpcomingMatches