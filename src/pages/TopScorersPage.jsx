import teams from '../data/teams.json'
import knockoutResults from '../data/knockoutResults.json'
import { useWorldCupResults } from '../hooks/useWorldCupResults'
import { computeTopScorers } from '../utils/topScorers'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function TopScorersPage() {
  useDocumentTitle('Top Scorers')
  const { results, loading } = useWorldCupResults()

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="font-body text-navy/60">Loading top scorers…</p>
      </div>
    )
  }

  const scorers = computeTopScorers(results, teams, knockoutResults)

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-pitch uppercase tracking-[0.2em] mb-3 text-center">
        Tournament Stats
      </p>
      <h1 className="font-display text-4xl text-navy mb-10 text-center">Top Scorers</h1>

      <div className="bg-chalk rounded-2xl border border-navy/10 overflow-hidden shadow-sm">
        {scorers.length === 0 && (
          <p className="font-body text-navy/50 text-center py-10">
            No goals recorded yet — check back once matches have been played.
          </p>
        )}

        {scorers.map((scorer, i) => (
          <div
            key={`${scorer.name}-${scorer.team?.id}`}
            className="flex items-center px-6 py-4 border-b border-navy/10 last:border-b-0"
          >
            <span className="font-mono text-sm text-navy/40 w-10 flex-shrink-0">{i + 1}</span>

            {scorer.photo ? (
              <img
                src={scorer.photo}
                alt={scorer.name}
                className="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0 bg-navy/10"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-navy/10 mr-3 flex-shrink-0 flex items-center justify-center text-navy/40 font-display text-sm">
                {scorer.name.charAt(0)}
              </div>
            )}

            {scorer.team && (
              <img
                src={`https://flagcdn.com/w40/${scorer.team.flagCode}.png`}
                alt={`${scorer.team.name} flag`}
                className="w-7 h-5 object-cover rounded-sm mr-3 flex-shrink-0"
              />
            )}

            <div className="flex-1">
              <p className="font-display text-lg text-navy">{scorer.name}</p>
              <p className="font-mono text-xs text-navy/50">
                {scorer.team?.name || 'Unknown'}
                {scorer.age ? ` · Age ${scorer.age}` : ''}
              </p>
            </div>

            <span className="font-display text-2xl text-gold">{scorer.goals}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopScorersPage