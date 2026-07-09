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
import FinalScore from '../components/FinalScore'
import MatchFacts from '../components/MatchFacts'
import { getKnockoutFixture } from '../utils/fixtures'
import { convertETtoSaudi } from '../utils/timezones'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const teamById = Object.fromEntries(teams.map((t) => [t.id, t]))
const stadiumById = Object.fromEntries(stadiums.map((s) => [s.id, s]))

function MatchPage() {
  const { id } = useParams()

  const groupMatch = matches.find((m) => m.id === id)
  const koFixture = groupMatch ? null : getKnockoutFixture(id)
  const isKnockout = Boolean(koFixture)

  const home = groupMatch
    ? teamById[groupMatch.homeTeam]
    : koFixture?.team1
      ? teamById[koFixture.team1]
      : null
  const away = groupMatch
    ? teamById[groupMatch.awayTeam]
    : koFixture?.team2
      ? teamById[koFixture.team2]
      : null
  const stadium = groupMatch
    ? stadiumById[groupMatch.stadium]
    : koFixture?.stadium
      ? stadiumById[koFixture.stadium]
      : null

  const story = groupMatch ? matchStories[groupMatch.id] : null
  const date = groupMatch?.date || koFixture?.date
  const time = groupMatch?.time || koFixture?.time
  const saudiTime = time ? convertETtoSaudi(time) : null

  // Hooks must run on every render, so this stays above any early return.
  useDocumentTitle(home && away ? `${home.name} vs ${away.name}` : 'Match')

  if (!groupMatch && !koFixture) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="font-display text-3xl text-navy">Match not found</p>
        <Link to="/" className="text-pitch underline mt-4 inline-block">
          Back to home
        </Link>
      </div>
    )
  }

  if (isKnockout && (!home || !away)) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="font-mono text-xs text-pitch uppercase tracking-[0.2em] mb-3">
          {koFixture.roundLabel}
        </p>
        <p className="font-display text-3xl text-navy">This matchup isn&apos;t set yet</p>
        <p className="font-body text-navy/60 mt-3">
          Both teams are decided once the previous round finishes.
        </p>
        <Link to="/knockout" className="text-pitch underline mt-5 inline-block">
          View the bracket
        </Link>
      </div>
    )
  }

  const sectionLinks = [
    ...(stadium ? [{ href: '#stadium', label: 'Stadium' }] : []),
    ...(story
      ? [
          { href: '#why', label: 'Why It Matters' },
          { href: '#players', label: 'Players' },
          { href: '#history', label: 'History' },
          { href: '#facts', label: 'Fun Facts' },
        ]
      : []),
    ...(isKnockout ? [] : [{ href: '#preview', label: 'AI Preview' }]),
  ]

  return (
    <div>
      <div className="bg-navy py-14 sm:py-20 text-center px-4 sm:px-6">
        <Link
          to={isKnockout ? '/knockout' : '/'}
          className="font-mono text-sm text-gold/80 hover:text-gold"
        >
          ← {isKnockout ? 'Back to the bracket' : 'Back to all matches'}
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6">
          <span className="bg-pitch text-chalk text-xs font-mono font-semibold px-3 py-1 rounded-full">
            {isKnockout ? koFixture.roundLabel : `Group ${groupMatch.group}`}
          </span>
          <span className="font-mono text-xs text-chalk/50 uppercase tracking-wide">
            {isKnockout ? 'Knockout Stage' : 'Group Stage'}
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

          <span className="font-display text-2xl sm:text-5xl text-gold whitespace-nowrap">
            {isKnockout && koFixture.score ? koFixture.score : 'VS'}
          </span>

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
          {date}
          {time && ` · ${time}`}
          {saudiTime && ` · ${saudiTime}`}
        </p>
        {stadium && (
          <p className="font-body text-chalk/50 text-sm mt-1">
            {stadium.name} — {stadium.city}
          </p>
        )}

        {story?.rivalry && (
          <p className="font-body text-gold/90 text-sm sm:text-lg italic max-w-xl mx-auto mt-6 px-2">
            {story.rivalry}
          </p>
        )}
      </div>

      {!isKnockout && (
        <FinalScore
          homeTeamId={groupMatch.homeTeam}
          homeTeamName={home.name}
          awayTeamId={groupMatch.awayTeam}
          awayTeamName={away.name}
          date={groupMatch.date}
        />
      )}

      {sectionLinks.length > 0 && (
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
      )}

      {stadium && (
        <section id="stadium" className="max-w-4xl mx-auto px-6 py-16">
          <p className="font-mono text-xs text-pitch uppercase tracking-[0.2em] mb-3">
            🏟 The Stadium
          </p>
          <p className="font-body text-navy/80 leading-relaxed text-lg">
            {stadium.name} in {stadium.city} holds {stadium.capacity} fans. {stadium.description}
          </p>
        </section>
      )}

      {isKnockout && (
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <MatchFacts matchId={koFixture.id} defaultOpen />
        </section>
      )}

      {story && (
        <>
          <WhyItMatters content={story.whyItMatters} rivalry={null} />
          <PlayersToWatch
            players={story.players}
            teams={teams}
            homeTeamId={groupMatch.homeTeam}
            awayTeamId={groupMatch.awayTeam}
          />
          <HeadToHead data={story.headToHead} />
          <FunFacts facts={story.funFacts} />
        </>
      )}

      {/* The preview API only knows group fixtures, so knockout pages skip it. */}
      {!isKnockout && <AIPreview text={story?.aiPreview} matchId={groupMatch.id} />}
    </div>
  )
}

export default MatchPage