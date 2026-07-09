import matches from '../data/matches.json'
import bracket from '../data/knockoutBracket.json'
import knockoutResults from '../data/knockoutResults.json'
import { resolveParticipants, formatScore, getWinner } from './knockoutResults'

const ROUND_LABELS = {
  roundOf32: 'Round of 32',
  roundOf16: 'Round of 16',
  quarterFinals: 'Quarterfinal',
  semiFinals: 'Semifinal',
  thirdPlace: 'Third Place',
  final: 'Final',
}

// Scheduling info (kickoff time, venue) lives in the bracket file.
const bracketById = {}
;[
  ...bracket.roundOf32,
  ...bracket.roundOf16,
  ...bracket.quarterFinals,
  ...bracket.semiFinals,
  ...bracket.thirdPlace,
  ...bracket.final,
].forEach((m) => {
  bracketById[m.id] = m
})

// Knockout fixtures, using the REAL dates from the results data (the bracket's
// dates were projections and drift from what actually happened).
export function getKnockoutFixtures() {
  return Object.values(knockoutResults).map((rec) => {
    const meta = bracketById[rec.id] || {}
    const [team1, team2] = resolveParticipants(rec.id)
    return {
      kind: 'knockout',
      id: rec.id,
      date: rec.date,
      time: meta.time || null,
      stadium: meta.stadium || null,
      roundLabel: ROUND_LABELS[rec.round] || rec.round,
      team1,
      team2,
      score: formatScore(rec.id),
      ft: rec.ft,
      et: rec.et,
      pens: rec.pens,
      winner: getWinner(rec.id),
      played: Boolean(rec.ft),
    }
  })
}

// A single knockout fixture (scheduling meta + resolved teams + score), or null.
export function getKnockoutFixture(id) {
  const rec = knockoutResults[id]
  if (!rec) return null
  const meta = bracketById[id] || {}
  const [team1, team2] = resolveParticipants(id)
  return {
    kind: 'knockout',
    id: rec.id,
    date: rec.date,
    time: meta.time || null,
    stadium: meta.stadium || null,
    roundLabel: ROUND_LABELS[rec.round] || rec.round,
    team1,
    team2,
    score: formatScore(id),
    ft: rec.ft,
    et: rec.et,
    pens: rec.pens,
    winner: getWinner(id),
    played: Boolean(rec.ft),
  }
}

export function getGroupFixtures() {
  return matches.map((m) => ({ kind: 'group', ...m }))
}

// Every date that has at least one match, group or knockout.
export function getAllFixtureDates() {
  const dates = new Set()
  matches.forEach((m) => dates.add(m.date))
  getKnockoutFixtures().forEach((f) => dates.add(f.date))
  return [...dates].sort()
}

export function getFixturesByDate(date) {
  const group = matches.filter((m) => m.date === date).map((m) => ({ kind: 'group', ...m }))
  const knockout = getKnockoutFixtures().filter((f) => f.date === date)
  return [...group, ...knockout]
}

// The next matches that haven't been played yet, soonest first.
// Group fixtures are all complete once the tournament reaches the knockouts,
// but they're included so this stays correct at any point in the tournament.
export function getUpcomingFixtures(today, limit = 4, groupResultsLookup) {
  const knockout = getKnockoutFixtures().filter((f) => !f.played && f.date >= today)

  const group = matches
    .filter((m) => m.date >= today)
    .filter((m) => (groupResultsLookup ? !groupResultsLookup(m) : true))
    .map((m) => ({ kind: 'group', ...m, roundLabel: `Group ${m.group}` }))

  return [...group, ...knockout]
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .slice(0, limit)
}