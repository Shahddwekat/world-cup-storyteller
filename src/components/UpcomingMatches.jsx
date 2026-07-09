import { Link } from 'react-router-dom'
import teams from '../data/teams.json'
import stadiums from '../data/stadiums.json'
import matchStories from '../data/matchStories.json'
import { getUpcomingFixtures } from '../utils/fixtures'
import { getToday } from '../utils/today'
import { convertETtoSaudi } from '../utils/timezones'

const teamById = Object.fromEntries(teams.map((t) => [t.id, t]))
const stadiumById = Object.fromEntries(stadiums.map((s) => [s.id, s]))

function dayLabel(dateStr, today) {
  if (dateStr === today) return 'Today'
  const d = new Date(dateStr + 'T00:00:00')
  const t = new Date(today + 'T00:00:00')
  if (Math.round((d - t) / 86400000) === 1) return 'Tomorrow'
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function TeamColumn({ team, score }) {
  if (!team) {
    return (
      <div className="flex flex-col items-center gap-2 w-24">
        <div className="w-12 h-8 rounded bg-navy/10" />
        <span className="font-mono text-xs text-navy/40 italic">TBD</span>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center gap-2 w-24">
      <img
        src={`https://flagcdn.com/w80/${team.flagCode}.png`}
        alt={`${team.name} flag`}
        className="w-12 h-8 object-cover rounded shadow"
      />
      <span className="font-display text-lg text-navy text-center leading-none">{team.name}</span>
      {score !== null && score !== undefined && (
        <span className="font-display text-2xl text-navy">{score}</span>
      )}
    </div>
  )
}

function FixtureCard({ fixture, today }) {
  const isKnockout = fixture.kind === 'knockout'

  const home = isKnockout
    ? fixture.team1
      ? teamById[fixture.team1]
      : null
    : teamById[fixture.homeTeam]
  const away = isKnockout
    ? fixture.team2
      ? teamById[fixture.team2]
      : null
    : teamById[fixture.awayTeam]

  const stadium = fixture.stadium ? stadiumById[fixture.stadium] : null
  const saudiTime = fixture.time ? convertETtoSaudi(fixture.time) : null

  const base = isKnockout ? fixture.et || fixture.ft : null
  const played = isKnockout && Boolean(base)

  const label = isKnockout ? fixture.roundLabel : `Group ${fixture.group}`
  const hasStory = !isKnockout && Boolean(matchStories[fixture.id])

  // A tie with undecided teams has no page worth visiting yet.
  const linkable = Boolean(home && away)
  const Wrapper = linkable ? Link : 'div'
  const wrapperProps = linkable ? { to: `/match/${fixture.id}` } : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={`bg-chalk rounded-2xl overflow-hidden shadow-lg flex flex-col ${
        linkable ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-200' : 'opacity-90'
      }`}
    >
      <div className="flex items-start justify-between px-5 pt-4 gap-3">
        <span className="bg-pitch text-chalk text-xs font-mono font-semibold px-3 py-1 rounded-full whitespace-nowrap">
          {label}
        </span>

        {played ? (
          <span className="bg-navy text-gold text-xs font-mono font-semibold px-3 py-1 rounded-full">
            FT
          </span>
        ) : (
          <span className="font-mono text-xs text-navy/60 text-right leading-tight">
            {dayLabel(fixture.date, today)}
            <br />
            {fixture.time}
            {saudiTime ? ` · ${saudiTime}` : ''}
          </span>
        )}
      </div>

      <div className="flex items-center justify-center gap-6 py-8">
        <TeamColumn team={home} score={played ? base[0] : null} />

        <div className="flex flex-col items-center">
          <span className="font-display text-gold text-2xl">VS</span>
          {fixture.pens && (
            <span className="font-mono text-[10px] text-navy/50 mt-1 whitespace-nowrap">
              {fixture.pens[0]}–{fixture.pens[1]} pens
            </span>
          )}
        </div>

        <TeamColumn team={away} score={played ? base[1] : null} />
      </div>

      <div className="border-t border-dashed border-navy/20 px-5 py-3 bg-navy/5 mt-auto">
        <p className="font-body text-sm text-navy/70">
          {stadium ? `${stadium.name} — ${stadium.city}` : 'Venue to be confirmed'}
        </p>
        {hasStory && (
          <p className="font-mono text-[10px] text-pitch uppercase tracking-wide mt-1">
            Full story inside
          </p>
        )}
      </div>
    </Wrapper>
  )
}

function UpcomingMatches({ limit = 6 }) {
  const today = getToday()
  const fixtures = getUpcomingFixtures(today, limit)

  if (fixtures.length === 0) {
    return (
      <p className="font-body text-navy/60">
        The tournament is over — head to the bracket to see how it finished.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {fixtures.map((f) => (
        <FixtureCard key={f.id} fixture={f} today={today} />
      ))}
    </div>
  )
}

export default UpcomingMatches