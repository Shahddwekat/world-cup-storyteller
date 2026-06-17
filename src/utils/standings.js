import { findFinalScore } from './matchResults'

export function computeStandings(allMatches, allTeams, results) {
  const groups = {}

  allTeams.forEach((team) => {
    if (!groups[team.group]) groups[team.group] = {}
    groups[team.group][team.id] = {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
    }
  })

  allMatches.forEach((match) => {
    const home = allTeams.find((t) => t.id === match.homeTeam)
    const away = allTeams.find((t) => t.id === match.awayTeam)
    if (!home || !away) return

    const score = findFinalScore(results, {
      homeTeamId: match.homeTeam,
      homeTeamName: home.name,
      awayTeamId: match.awayTeam,
      awayTeamName: away.name,
      date: match.date,
    })

    if (!score) return

    const group = match.group
    const homeRecord = groups[group][match.homeTeam]
    const awayRecord = groups[group][match.awayTeam]

    homeRecord.played += 1
    awayRecord.played += 1
    homeRecord.gf += score.homeScore
    homeRecord.ga += score.awayScore
    awayRecord.gf += score.awayScore
    awayRecord.ga += score.homeScore

    if (score.homeScore > score.awayScore) {
      homeRecord.won += 1
      awayRecord.lost += 1
    } else if (score.homeScore < score.awayScore) {
      awayRecord.won += 1
      homeRecord.lost += 1
    } else {
      homeRecord.drawn += 1
      awayRecord.drawn += 1
    }
  })

  const standings = {}
  Object.keys(groups)
    .sort()
    .forEach((groupLetter) => {
      const teamRecords = Object.values(groups[groupLetter]).map((r) => ({
        ...r,
        gd: r.gf - r.ga,
        points: r.won * 3 + r.drawn,
      }))

      teamRecords.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points
        if (b.gd !== a.gd) return b.gd - a.gd
        return b.gf - a.gf
      })

      standings[groupLetter] = teamRecords
    })

  return standings
}