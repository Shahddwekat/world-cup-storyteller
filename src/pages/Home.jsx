import Hero from '../components/Hero'
import MatchCard from '../components/MatchCard'
import matches from '../data/matches.json'
import teams from '../data/teams.json'
import stadiums from '../data/stadiums.json'
import { useWorldCupResults } from '../hooks/useWorldCupResults'
import { getToday } from '../utils/today'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function Home() {
  useDocumentTitle()
  const today = getToday()
  const upcoming = matches.filter((m) => m.date >= today).slice(0, 6)
  const { results } = useWorldCupResults()

  return (
    <>
      <Hero />

      <section id="matches" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-display text-4xl text-navy mb-8">
          Upcoming Matches
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              teams={teams}
              stadiums={stadiums}
              results={results}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default Home