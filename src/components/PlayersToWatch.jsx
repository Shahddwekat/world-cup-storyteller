function PlayersToWatch({ players, teams, homeTeamId, awayTeamId }) {
  const homeTeam = teams.find((t) => t.id === homeTeamId)
  const awayTeam = teams.find((t) => t.id === awayTeamId)
  const homePlayers = players.filter((p) => p.teamId === homeTeamId)
  const awayPlayers = players.filter((p) => p.teamId === awayTeamId)

  const renderColumn = (team, list) => (
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-5">
        <img
          src={`https://flagcdn.com/w40/${team.flagCode}.png`}
          alt={`${team.name} flag`}
          className="w-8 h-6 object-cover rounded-sm"
        />
        <span className="font-display text-2xl text-navy">{team.name}</span>
      </div>

      <div className="space-y-4">
        {list.map((player, i) => (
          <div key={i} className="bg-chalk border border-navy/10 rounded-xl p-5">
            <p className="font-display text-xl text-navy">{player.name}</p>
            <p className="font-mono text-xs text-pitch uppercase tracking-wide mb-2">
              {player.role}
            </p>
            <p className="font-body text-sm text-navy/70 leading-relaxed">{player.blurb}</p>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <section id="players" className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-pitch uppercase tracking-[0.2em] mb-8">
        Players to Watch
      </p>

      <div className="flex flex-col sm:flex-row gap-10 sm:gap-14">
        {renderColumn(homeTeam, homePlayers)}
        <div className="hidden sm:block w-px bg-navy/10" />
        {renderColumn(awayTeam, awayPlayers)}
      </div>
    </section>
  )
}

export default PlayersToWatch