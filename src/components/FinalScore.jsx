import { useWorldCupResults } from '../hooks/useWorldCupResults'
import { findFinalScore } from '../utils/matchResults'

function FinalScore({ homeTeamId, homeTeamName, awayTeamId, awayTeamName, date }) {
  const { results, loading } = useWorldCupResults()

  if (loading) return null

  const score = findFinalScore(results, { homeTeamId, homeTeamName, awayTeamId, awayTeamName, date })
  if (!score) return null

  return (
    <section className="bg-pitch px-6 py-10">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-mono text-xs text-chalk/70 uppercase tracking-[0.2em] mb-3">
          Full Time
        </p>
        <p className="font-display text-5xl text-chalk">
          {score.homeScore} – {score.awayScore}
        </p>

        <div className="flex justify-center gap-12 mt-6 text-left">
          <div>
            {score.homeGoals?.map((g, i) => (
              <p key={i} className="font-body text-sm text-chalk/80">
                {g.name} {g.minute}'
              </p>
            ))}
          </div>
          <div>
            {score.awayGoals?.map((g, i) => (
              <p key={i} className="font-body text-sm text-chalk/80">
                {g.name} {g.minute}'
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalScore