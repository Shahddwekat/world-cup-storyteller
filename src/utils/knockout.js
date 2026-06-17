import { computeStandings } from './standings'

export function getGroupQualifiers(matches, teams, results) {
  const standings = computeStandings(matches, teams, results)
  const groupComplete = {}
  const winners = {}
  const runnersUp = {}
  const thirdPlaceCandidates = []

  Object.entries(standings).forEach(([groupLetter, records]) => {
    const groupMatches = matches.filter((m) => m.group === groupLetter)
    const playedCount = records.reduce((sum, r) => sum + r.played, 0) / 2
    const isComplete = playedCount === groupMatches.length

    groupComplete[groupLetter] = isComplete

    if (isComplete) {
      winners[groupLetter] = records[0].team
      runnersUp[groupLetter] = records[1].team
      thirdPlaceCandidates.push({ ...records[2], group: groupLetter })
    }
  })

  thirdPlaceCandidates.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.gd !== a.gd) return b.gd - a.gd
    return b.gf - a.gf
  })

  const advancingThirds = thirdPlaceCandidates.slice(0, 8)

  return { winners, runnersUp, advancingThirds, groupComplete }
}

// Assigns advancing third-place teams to their candidate match slots using
// backtracking, guaranteeing a valid assignment exists if one is possible.
export function assignThirdPlaceSlots(advancingThirds, matchSlots) {
  const assignment = {}
  const usedGroups = new Set()

  function backtrack(index) {
    if (index === matchSlots.length) return true
    const slot = matchSlots[index]
    const candidates = advancingThirds.filter(
      (t) => slot.candidateGroups.includes(t.group) && !usedGroups.has(t.group)
    )
    for (const candidate of candidates) {
      usedGroups.add(candidate.group)
      assignment[slot.matchId] = candidate.team
      if (backtrack(index + 1)) return true
      usedGroups.delete(candidate.group)
      delete assignment[slot.matchId]
    }
    return false
  }

  backtrack(0)
  return assignment
}