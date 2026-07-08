import { useState } from 'react'
import knockoutBracket from '../data/knockoutBracket.json'
import teams from '../data/teams.json'
import stadiums from '../data/stadiums.json'
import BracketView from '../components/BracketView'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import {
  resolveParticipants,
  formatScore,
  getWinner,
  getKnockoutMatch,
} from '../utils/knockoutResults'

const teamById = Object.fromEntries(teams.map((t) => [t.id, t]))
const stadiumById = Object.fromEntries(stadiums.map((s) => [s.id, s]))

const ROUNDS = [
  { key: 'roundOf32', label: 'Round of 32' },
  { key: 'roundOf16', label: 'Round of 16' },
  { key: 'quarterFinals', label: 'Quarterfinals' },
  { key: 'semiFinals', label: 'Semifinals' },
  { key: 'thirdPlace', label: 'Third Place' },
  { key: 'final', label: 'Final' },
]

function TeamLine({ id, isWinner, played }) {
  const team = id ? teamById[id] : null
  if (!team) {
    return <span className="font-mono text-xs text-navy/40 italic">TBD</span>
  }
  return (
    <div className={`flex items-center gap-2 ${played && !isWinner ? 'opacity-50' : ''}`}>
      <img
        src={`https://flagcdn.com/w40/${team.flagCode}.png`}
        alt={`${team.name} flag`}
        className="w-6 h-4 object-cover rounded-sm"
      />
      <span className={`font-display text-base ${isWinner ? 'text-pitch font-bold' : 'text-navy'}`}>
        {team.name}
      </span>
    </div>
  )
}

function MatchCard({ match }) {
  const rec = getKnockoutMatch(match.id)
  const [id1, id2] = resolveParticipants(match.id)
  const score = formatScore(match.id)
  const winner = getWinner(match.id)
  const played = Boolean(score)
  const stadium = stadiumById[match.stadium]
  const dateStr = rec?.date || match.date
  const dateLabel = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="bg-chalk border border-navy/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs text-navy/50">
          {dateLabel}
          {stadium ? ` · ${stadium.city}` : ''}
        </span>
        {played ? (
          <span className="bg-pitch/10 text-pitch text-[10px] font-mono font-semibold px-2 py-1 rounded-full">
            {score}
          </span>
        ) : (
          <span className="bg-gold/20 text-pitch text-[10px] font-mono font-semibold px-2 py-1 rounded-full">
            Upcoming
          </span>
        )}
      </div>

      <div className="space-y-2">
        <TeamLine id={id1} isWinner={played && winner === id1} played={played} />
        <TeamLine id={id2} isWinner={played && winner === id2} played={played} />
      </div>
    </div>
  )
}

function KnockoutPage() {
  useDocumentTitle('Knockout Bracket')
  const [view, setView] = useState('bracket')

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <p className="font-mono text-xs text-pitch uppercase tracking-[0.2em]">Knockout Stage</p>

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

      <h1 className="font-display text-4xl text-navy mb-3">Knockout Bracket</h1>
      <p className="font-body text-navy/60 mb-10 max-w-2xl">
        Real results through the round played so far. Winners advance automatically as each
        round completes; upcoming rounds show their matchups once both feeding results are in.
      </p>

      {view === 'bracket' ? (
        <BracketView />
      ) : (
        <>
          {ROUNDS.map(({ key, label }) => (
            <div key={key} className="mb-12">
              <h2 className="font-display text-2xl text-navy mb-5">{label}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {knockoutBracket[key].map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default KnockoutPage