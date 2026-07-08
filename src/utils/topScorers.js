import { matchesTeamName } from './matchResults'
import playerPhotos from '../data/playerPhotos.json'

// Tallies goals across the group stage (matched by team name) and, optionally,
// the knockout rounds (matched by team id). Own goals never count toward a scorer.
export function computeTopScorers(allResults, teams, knockoutMatches) {
  const tally = {}
  const teamById = Object.fromEntries(teams.map((t) => [t.id, t]))

  const addGoals = (goalsArr, team) => {
    ;(goalsArr || []).forEach((g) => {
      if (g.og) return // own goals don't count toward the scorer
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

  // Group stage (fixtures store team names)
  ;(allResults || []).forEach((fixture) => {
    if (!fixture.score) return
    const homeTeam = teams.find((t) => matchesTeamName(fixture.team1, t.name, t.id))
    const awayTeam = teams.find((t) => matchesTeamName(fixture.team2, t.name, t.id))
    addGoals(fixture.goals1, homeTeam)
    addGoals(fixture.goals2, awayTeam)
  })

  // Knockout rounds (matches store team ids)
  if (knockoutMatches) {
    Object.values(knockoutMatches).forEach((m) => {
      if (!m.ft) return
      addGoals(m.goals1, teamById[m.team1])
      addGoals(m.goals2, teamById[m.team2])
    })
  }

  return Object.values(tally).sort((a, b) => b.goals - a.goals)
}