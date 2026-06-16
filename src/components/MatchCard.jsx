function MatchCard({ match, teams, stadiums }) {
  const home = teams.find((t) => t.id === match.homeTeam)
  const away = teams.find((t) => t.id === match.awayTeam)
  const stadium = stadiums.find((s) => s.id === match.stadium)

  const dateLabel = new Date(match.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="bg-chalk rounded-2xl overflow-hidden shadow-lg flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <span className="bg-pitch text-chalk text-xs font-mono font-semibold px-3 py-1 rounded-full">
          Group {match.group}
        </span>
        <span className="font-mono text-sm text-navy/60">
          {dateLabel} · {match.time}
        </span>
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
        </div>
      </div>

      <div className="border-t border-dashed border-navy/20 px-5 py-3 bg-navy/5">
        <p className="font-body text-sm text-navy/70">
          {stadium.name} — {stadium.city}
        </p>
      </div>
    </div>
  )
}

export default MatchCard