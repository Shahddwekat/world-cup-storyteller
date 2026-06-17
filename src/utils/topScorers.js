import { matchesTeamName } from './matchResults'
import playerPhotos from '../data/playerPhotos.json'

export function computeTopScorers(allResults, teams) {
  if (!allResults) return []

  const tally = {}

  allResults.forEach((fixture) => {
    if (!fixture.score) return

    const homeTeam = teams.find((t) => matchesTeamName(fixture.team1, t.name, t.id))
    const awayTeam = teams.find((t) => matchesTeamName(fixture.team2, t.name, t.id))

    const addGoals = (goalsArr, team) => {
      ;(goalsArr || []).forEach((g) => {
        const key = `${g.name}|${team?.id || 'unknown'}`
        if (!tally[key]) {
          const extra = playerPhotos[key] || {}
          tally[key] = {
            name: g.name,
            goals: 0,
            team,
            photo: extra.photo || null,
            age: extra.age || null,
          }
        }
        tally[key].goals += 1
      })
    }

    addGoals(fixture.goals1, homeTeam)
    addGoals(fixture.goals2, awayTeam)
  })

  return Object.values(tally).sort((a, b) => b.goals - a.goals)
}