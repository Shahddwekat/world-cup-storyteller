const NAME_ALIASES = {
  kor: 'South Korea',
  cze: 'Czech Republic',
  tur: 'Turkey',
}

export function matchesTeamName(ofName, ourName, ourId) {
  const alias = NAME_ALIASES[ourId]
  const normalized = ofName.trim().toLowerCase()
  return (
    normalized === ourName.trim().toLowerCase() ||
    (alias && normalized === alias.toLowerCase())
  )
}

export function findFinalScore(allResults, { homeTeamId, homeTeamName, awayTeamId, awayTeamName, date }) {
  if (!allResults) return null

  const found = allResults.find((m) => {
    if (!m.score) return false
    if (m.date !== date) return false
    const homeFirst =
      matchesTeamName(m.team1, homeTeamName, homeTeamId) &&
      matchesTeamName(m.team2, awayTeamName, awayTeamId)
    const awayFirst =
      matchesTeamName(m.team1, awayTeamName, awayTeamId) &&
      matchesTeamName(m.team2, homeTeamName, homeTeamId)
    return homeFirst || awayFirst
  })

  if (!found) return null

  const isHomeTeam1 = matchesTeamName(found.team1, homeTeamName, homeTeamId)
  const [score1, score2] = found.score.ft
  return {
    homeScore: isHomeTeam1 ? score1 : score2,
    awayScore: isHomeTeam1 ? score2 : score1,
    homeGoals: isHomeTeam1 ? found.goals1 : found.goals2,
    awayGoals: isHomeTeam1 ? found.goals2 : found.goals1,
  }
}