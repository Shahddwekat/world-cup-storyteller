import { useState } from 'react'
import knockoutBracket from '../data/knockoutBracket.json'
import matches from '../data/matches.json'
import teams from '../data/teams.json'
import stadiums from '../data/stadiums.json'
import { useWorldCupResults } from '../hooks/useWorldCupResults'
import { getGroupQualifiers, assignThirdPlaceSlots } from '../utils/knockout'
import BracketView from '../components/BracketView'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function slotLabel(slot) {
  if (slot.type === 'winner') return `Winner Group ${slot.group}`
  if (slot.type === 'runnerup') return `Runner-up Group ${slot.group}`
  if (slot.type === 'thirdplace') return `3rd Place (${slot.candidateGroups.join('/')})`
  return 'TBD'
}

function TeamSlot({ team, fallbackLabel }) {
  if (!team) {
    return <span className="font-mono text-xs text-navy/40 italic">{fallbackLabel}</span>
  }
  return (
    <div className="flex items-center gap-2">
      <img
        src={`https://flagcdn.com/w40/${team.flagCode}.png`}
        alt={`${team.name} flag`}
        className="w-6 h-4 object-cover rounded-sm"
      />
      <span className="font-display text-base text-navy">{team.name}</span>
    </div>
  )
}

function KnockoutPage() {
  useDocumentTitle('Knockout Bracket')
  const { results, loading } = useWorldCupResults()
  const [view, setView] = useState('bracket')

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="font-body text-navy/60">Loading bracket…</p>
      </div>
    )
  }

  const qualifiers = getGroupQualifiers(matches, teams, results)

  const thirdPlaceMatches = knockoutBracket.roundOf32.filter(
    (m) => m.slot1.type === 'thirdplace' || m.slot2.type === 'thirdplace'
  )
  const matchSlots = thirdPlaceMatches.map((m) => ({
    matchId: m.id,
    candidateGroups: (m.slot1.type === 'thirdplace' ? m.slot1 : m.slot2).candidateGroups,
  }))
  const thirdPlaceAssignment = assignThirdPlaceSlots(qualifiers.advancingThirds, matchSlots)

  function resolve(slot, matchId) {
    if (slot.type === 'winner') return qualifiers.winners[slot.group] || null
    if (slot.type === 'runnerup') return qualifiers.runnersUp[slot.group] || null
    if (slot.type === 'thirdplace') return thirdPlaceAssignment[matchId] || null
    return null
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <p className="font-mono text-xs text-pitch uppercase tracking-[0.2em]">
          Knockout Stage
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setView('bracket')}
            className={`font-mono text-xs uppercase px-3 py-1.5 rounded-full transition-colors ${
              view === 'bracket' ? 'bg-navy text-gold' : 'bg-navy/10 text-navy/60'
            }`}
          >
            Bracket View
          </button>
          <button
            onClick={() => setView('list')}
            className={`font-mono text-xs uppercase px-3 py-1.5 rounded-full transition-colors ${
              view === 'list' ? 'bg-navy text-gold' : 'bg-navy/10 text-navy/60'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      <h1 className="font-display text-4xl text-navy mb-3">Round of 32</h1>
      <p className="font-body text-navy/60 mb-10 max-w-2xl">
        Slots fill in automatically as each group finishes. Matches involving a
        best-third-placed-team slot are our best estimate — FIFA's official
        assignment depends on a 495-combination table we can't fully replicate.
      </p>

      {view === 'bracket' ? (
        <BracketView resolve={resolve} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {knockoutBracket.roundOf32.map((match) => {
              const stadium = stadiums.find((s) => s.id === match.stadium)
              const team1 = resolve(match.slot1, match.id)
              const team2 = resolve(match.slot2, match.id)
              const isProjected =
                match.slot1.type === 'thirdplace' || match.slot2.type === 'thirdplace'
              const dateLabel = new Date(match.date + 'T00:00:00').toLocaleDateString(
                'en-US',
                { month: 'short', day: 'numeric' }
              )

              return (
                <div key={match.id} className="bg-chalk border border-navy/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-navy/50">
                      {dateLabel} · {stadium?.city}
                    </span>
                    {isProjected && (
                      <span className="bg-gold/20 text-pitch text-[10px] font-mono font-semibold px-2 py-1 rounded-full">
                        Projected
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <TeamSlot team={team1} fallbackLabel={slotLabel(match.slot1)} />
                    <span className="font-display text-gold">vs</span>
                    <TeamSlot team={team2} fallbackLabel={slotLabel(match.slot2)} />
                  </div>
                </div>
              )
            })}
          </div>

          <h2 className="font-display text-3xl text-navy mt-16 mb-6">Round of 16 Onward</h2>
          <p className="font-body text-navy/60 mb-8 max-w-2xl">
            These rounds depend on Round of 32 results, so they'll stay as placeholders
            for now.
          </p>

          {[
            { label: 'Round of 16', list: knockoutBracket.roundOf16 },
            { label: 'Quarterfinals', list: knockoutBracket.quarterFinals },
            { label: 'Semifinals', list: knockoutBracket.semiFinals },
            { label: 'Third Place', list: knockoutBracket.thirdPlace },
            { label: 'Final', list: knockoutBracket.final },
          ].map(({ label, list }) => (
            <div key={label} className="mb-10">
              <h3 className="font-display text-xl text-navy mb-4">{label}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {list.map((match) => {
                  const stadium = stadiums.find((s) => s.id === match.stadium)
                  const dateLabel = new Date(match.date + 'T00:00:00').toLocaleDateString(
                    'en-US',
                    { month: 'short', day: 'numeric' }
                  )
                  return (
                    <div key={match.id} className="bg-chalk border border-navy/10 rounded-xl p-4">
                      <p className="font-mono text-xs text-navy/50 mb-2">
                        {dateLabel} · {stadium?.city}
                      </p>
                      <p className="font-body text-sm text-navy/70">
                        {match.loserFrom1
                          ? `Loser of M${match.loserFrom1.slice(1)} vs Loser of M${match.loserFrom2.slice(1)}`
                          : `Winner of M${match.from1.slice(1)} vs Winner of M${match.from2.slice(1)}`}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default KnockoutPage