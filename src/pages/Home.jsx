import Hero from '../components/Hero'
import UpcomingMatches from '../components/UpcomingMatches'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function Home() {
  useDocumentTitle()

  return (
    <>
      <Hero />

      <section id="matches" className="max-w-6xl mx-auto px-6 py-16">
        <p className="font-mono text-xs text-pitch uppercase tracking-[0.2em] mb-3">
          Next Up
        </p>
        <h2 className="font-display text-4xl text-navy mb-8">Upcoming Matches</h2>

        <UpcomingMatches limit={6} />
      </section>
    </>
  )
}

export default Home