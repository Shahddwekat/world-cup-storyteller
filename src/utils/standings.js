import { findFinalScore } from './matchResults'

const normalize = (s) => s?.toLowerCase().trim()
  .replace(/ü/g, 'u')
  .replace(/é/g, 'e')
  .replace(/ó/g, 'o')
  .replace(/í/g, 'i')
  .replace(/ú/g, 'u')
  .replace(/á/g, 'a')

function teamsMatch(a, b) {
  return normalize(a) === normalize(b)
}

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

    const score = results?.find((r) => {
      if (!r.score) return false
      if (r.date !== match.date) return false
      const normalForward =
        (teamsMatch(r.team1, home.name) || teamsMatch(r.team1, 'South Korea') && home.id === 'kor' ||
         teamsMatch(r.team1, 'Czech Republic') && home.id === 'cze' ||
         teamsMatch(r.team1, 'Turkey') && home.id === 'tur' ||
         teamsMatch(r.team1, 'Turkiye') && home.id === 'tur' ||
         teamsMatch(r.team1, 'Ivory Coast') && home.id === 'civ' ||
         teamsMatch(r.team1, 'DR Congo') && home.id === 'cod') &&
        (teamsMatch(r.team2, away.name) || teamsMatch(r.team2, 'South Korea') && away.id === 'kor' ||
         teamsMatch(r.team2, 'Czech Republic') && away.id === 'cze' ||
         teamsMatch(r.team2, 'Turkey') && away.id === 'tur' ||
         teamsMatch(r.team2, 'Turkiye') && away.id === 'tur' ||
         teamsMatch(r.team2, 'Ivory Coast') && away.id === 'civ' ||
         teamsMatch(r.team2, 'DR Congo') && away.id === 'cod')
      const normalReverse =
        (teamsMatch(r.team2, home.name) || teamsMatch(r.team2, 'South Korea') && home.id === 'kor' ||
         teamsMatch(r.team2, 'Czech Republic') && home.id === 'cze' ||
         teamsMatch(r.team2, 'Turkey') && home.id === 'tur' ||
         teamsMatch(r.team2, 'Turkiye') && home.id === 'tur' ||
         teamsMatch(r.team2, 'Ivory Coast') && home.id === 'civ' ||
         teamsMatch(r.team2, 'DR Congo') && home.id === 'cod') &&
        (teamsMatch(r.team1, away.name) || teamsMatch(r.team1, 'South Korea') && away.id === 'kor' ||
         teamsMatch(r.team1, 'Czech Republic') && away.id === 'cze' ||
         teamsMatch(r.team1, 'Turkey') && away.id === 'tur' ||
         teamsMatch(r.team1, 'Turkiye') && away.id === 'tur' ||
         teamsMatch(r.team1, 'Ivory Coast') && away.id === 'civ' ||
         teamsMatch(r.team1, 'DR Congo') && away.id === 'cod')
      return normalForward || normalReverse
    })

    if (!score) return

    const isHomeTeam1 =
      teamsMatch(score.team1, home.name) ||
      (teamsMatch(score.team1, 'South Korea') && home.id === 'kor') ||
      (teamsMatch(score.team1, 'Czech Republic') && home.id === 'cze') ||
      ((teamsMatch(score.team1, 'Turkey') || teamsMatch(score.team1, 'Turkiye')) && home.id === 'tur') ||
      (teamsMatch(score.team1, 'Ivory Coast') && home.id === 'civ') ||
      (teamsMatch(score.team1, 'DR Congo') && home.id === 'cod')

    const [s1, s2] = score.score.ft
    const homeScore = isHomeTeam1 ? s1 : s2
    const awayScore = isHomeTeam1 ? s2 : s1

    const group = match.group
    const homeRecord = groups[group]?.[match.homeTeam]
    const awayRecord = groups[group]?.[match.awayTeam]
    if (!homeRecord || !awayRecord) return

    homeRecord.played += 1
    awayRecord.played += 1
    homeRecord.gf += homeScore
    homeRecord.ga += awayScore
    awayRecord.gf += awayScore
    awayRecord.ga += homeScore

    if (homeScore > awayScore) {
      homeRecord.won += 1
      awayRecord.lost += 1
    } else if (homeScore < awayScore) {
      awayRecord.won += 1
      homeRecord.lost += 1
    } else {
      homeRecord.drawn += 1
      awayRecord.drawn += 1
    }
  })

  const standings = {}
  Object.keys(groups).sort().forEach((groupLetter) => {
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