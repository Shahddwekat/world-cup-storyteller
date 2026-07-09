import Hero from '../components/Hero'
import UpcomingMatches from '../components/UpcomingMatches'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function Home() {
  useDocumentTitle()

  return (
    <>
      <Hero />

      <section id="matches" className="max-w-6xl mx-auto px-6 py-16">
        <UpcomingMatches limit={6} />
      </section>
    </>
  )
}

export default Home