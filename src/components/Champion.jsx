import { Link } from 'react-router-dom'
import teams from '../data/teams.json'
import { getChampion } from '../utils/fixtures'

const teamById = Object.fromEntries(teams.map((t) => [t.id, t]))

function Champion() {
  const result = getChampion()
  if (!result) return null

  const champion = teamById[result.championId]
  const runnerUp = teamById[result.runnerUpId]
  if (!champion || !runnerUp) return null

  return (
    <section className="bg-navy rounded-3xl px-6 py-12 sm:py-16 text-center overflow-hidden relative">
      <p className="font-mono text-xs text-gold uppercase tracking-[0.3em] mb-6">
        Champions of the World
      </p>

      <div className="flex flex-col items-center gap-4">
        <span className="text-4xl">🏆</span>
        <img
          src={`https://flagcdn.com/w160/${champion.flagCode}.png`}
          alt={`${champion.name} flag`}
          className="w-24 h-16 object-cover rounded-lg shadow-2xl ring-2 ring-gold/40"
        />
        <h2 className="font-display text-4xl sm:text-6xl text-gold tracking-wide">
          {champion.name}
        </h2>
      </div>

      <p className="font-body text-chalk/70 mt-6 max-w-md mx-auto">
        {champion.name} beat {runnerUp.name} {result.scoreLine} in the final to lift the 2026 FIFA
        World Cup.
      </p>

      <Link
        to={`/match/${result.finalId}`}
        className="inline-block mt-8 bg-gold text-navy font-mono text-sm font-semibold uppercase tracking-wide px-6 py-3 rounded-full hover:bg-gold/90 transition-colors"
      >
        Relive the final
      </Link>

      <div className="mt-4">
        <Link
          to="/knockout"
          className="font-mono text-xs text-chalk/50 uppercase tracking-wide hover:text-gold transition-colors"
        >
          See the full bracket →
        </Link>
      </div>
    </section>
  )
}

export default Champion