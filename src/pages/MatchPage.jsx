import { useParams, Link } from 'react-router-dom'
import matches from '../data/matches.json'
import teams from '../data/teams.json'
import stadiums from '../data/stadiums.json'
import matchStories from '../data/matchStories.json'
import WhyItMatters from '../components/WhyItMatters'
import PlayersToWatch from '../components/PlayersToWatch'
import HeadToHead from '../components/HeadToHead'
import FunFacts from '../components/FunFacts'
import AIPreview from '../components/AIPreview'

function MatchPage() {
  const { id } = useParams()
  const match = matches.find((m) => m.id === id)

  if (!match) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="font-display text-3xl text-navy">Match not found</p>
        <Link to="/" className="text-pitch underline mt-4 inline-block">
          Back to home
        </Link>
      </div>
    )
  }

  const home = teams.find((t) => t.id === match.homeTeam)
  const away = teams.find((t) => t.id === match.awayTeam)
  const stadium = stadiums.find((s) => s.id === match.stadium)
  const story = matchStories[match.id]

  const sectionLinks = [
    { href: '#stadium', label: 'Stadium' },
    ...(story
      ? [
          { href: '#why', label: 'Why It Matters' },
          { href: '#players', label: 'Players' },
          { href: '#history', label: 'History' },
          { href: '#facts', label: 'Fun Facts' },
        ]
      : []),
    { href: '#preview', label: 'AI Preview' },
  ]

  return (
    <div>
      <div className="bg-navy py-14 sm:py-20 text-center px-4 sm:px-6">
        <Link to="/" className="font-mono text-sm text-gold/80 hover:text-gold">
          ← Back to all matches
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6">
          <span className="bg-pitch text-chalk text-xs font-mono font-semibold px-3 py-1 rounded-full">
            Group {match.group}
          </span>
          <span className="font-mono text-xs text-chalk/50 uppercase tracking-wide">
            Group Stage · Matchday 1
          </span>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-16 mt-8 sm:mt-10">
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <img
              src={`https://flagcdn.com/w160/${home.flagCode}.png`}
              alt={`${home.name} flag`}
              className="w-14 sm:w-24 h-10 sm:h-16 object-cover rounded-lg shadow-lg"
            />
            <span className="font-display text-base sm:text-4xl text-chalk text-center leading-tight max-w-[110px] sm:max-w-none">
              {home.name}
            </span>
          </div>

          <span className="font-display text-2xl sm:text-5xl text-gold">VS</span>

          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <img
              src={`https://flagcdn.com/w160/${away.flagCode}.png`}
              alt={`${away.name} flag`}
              className="w-14 sm:w-24 h-10 sm:h-16 object-cover rounded-lg shadow-lg"
            />
            <span className="font-display text-base sm:text-4xl text-chalk text-center leading-tight max-w-[110px] sm:max-w-none">
              {away.name}
            </span>
          </div>
        </div>

        <p className="font-mono text-chalk/60 mt-8 text-sm sm:text-base">
          {match.date} · {match.time}
        </p>
        <p className="font-body text-chalk/50 text-sm mt-1">
          {stadium.name} — {stadium.city}
        </p>

        {story?.rivalry && (
          <p className="font-body text-gold/90 text-sm sm:text-lg italic max-w-xl mx-auto mt-6 px-2">
            {story.rivalry}
          </p>
        )}
      </div>

      <nav className="sticky top-16 z-40 bg-chalk border-b border-navy/10 px-6 overflow-x-auto">
        <div className="max-w-4xl mx-auto flex gap-6 py-3">
          {sectionLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs uppercase tracking-wide text-navy/60 hover:text-pitch whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      <section id="stadium" className="max-w-4xl mx-auto px-6 py-16">
        <p className="font-mono text-xs text-pitch uppercase tracking-[0.2em] mb-3">
          🏟 The Stadium
        </p>
        <p className="font-body text-navy/80 leading-relaxed text-lg">
          {stadium.name} in {stadium.city} holds {stadium.capacity} fans. {stadium.description}
        </p>
      </section>

      {story && (
        <>
          <WhyItMatters content={story.whyItMatters} rivalry={null} />
          <PlayersToWatch
            players={story.players}
            teams={teams}
            homeTeamId={match.homeTeam}
            awayTeamId={match.awayTeam}
          />
          <HeadToHead data={story.headToHead} />
          <FunFacts facts={story.funFacts} />
        </>
      )}

      <AIPreview
        text={story?.aiPreview}
        matchContext={{
          homeTeam: home.name,
          awayTeam: away.name,
          stadiumName: stadium.name,
          stadiumCity: stadium.city,
          group: match.group,
        }}
      />
    </div>
  )
}

export default MatchPage