import bracket from '../data/knockoutBracket.json'
import results from '../data/knockoutResults.json'

// Flat lookup of the bracket structure (feed chain: from1/from2, loserFrom1/2)
const structById = {}
;[
  ...bracket.roundOf32,
  ...bracket.roundOf16,
  ...bracket.quarterFinals,
  ...bracket.semiFinals,
  ...bracket.thirdPlace,
  ...bracket.final,
].forEach((m) => {
  structById[m.id] = m
})

export function getKnockoutMatch(id) {
  return results[id] || null
}

function loserOf(id) {
  const r = results[id]
  if (!r || !r.winner) return null
  return r.winner === r.team1 ? r.team2 : r.team1
}

// Returns [team1Id, team2Id]. Uses concrete teams from the data when available,
// otherwise falls back to the winner (or loser) of the feeding match, so future
// rounds fill in automatically once their feeders have a result.
export function resolveParticipants(id) {
  const r = results[id]
  const s = structById[id] || {}
  let t1 = r?.team1 ?? null
  let t2 = r?.team2 ?? null

  if (!t1) {
    if (s.from1) t1 = results[s.from1]?.winner ?? null
    else if (s.loserFrom1) t1 = loserOf(s.loserFrom1)
  }
  if (!t2) {
    if (s.from2) t2 = results[s.from2]?.winner ?? null
    else if (s.loserFrom2) t2 = loserOf(s.loserFrom2)
  }
  return [t1, t2]
}

// Human-readable score, e.g. "1–1 (4–3 pens)", "2–1 (a.e.t.)", or "3–0".
// Returns null when the match hasn't been played.
export function formatScore(id) {
  const r = results[id]
  if (!r || !r.ft) return null
  const base = r.et || r.ft
  let str = `${base[0]}\u2013${base[1]}`
  if (r.pens) str += ` (${r.pens[0]}\u2013${r.pens[1]} pens)`
  else if (r.et) str += ' (a.e.t.)'
  return str
}

export function getWinner(id) {
  return results[id]?.winner ?? null
}