import { useState } from 'react'
import matches from '../data/matches.json'
import teams from '../data/teams.json'
import stadiums from '../data/stadiums.json'
import MatchRow from '../components/MatchRow'
import { useWorldCupResults } from '../hooks/useWorldCupResults'
import { getToday } from '../utils/today'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function groupByDate(allMatches) {
  const groups = {}
  allMatches.forEach((m) => {
    if (!groups[m.date]) groups[m.date] = []
    groups[m.date].push(m)
  })
  return groups
}

function SchedulePage() {
  const { results } = useWorldCupResults()
  const grouped = groupByDate(matches)
  const dates = Object.keys(grouped).sort()
  const today = getToday()

  const todayIndex = dates.findIndex((d) => d >= today)
  const initialIndex = todayIndex === -1 ? dates.length - 1 : todayIndex
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const currentDate = dates[currentIndex]
  const isToday = currentDate === today
  const dateLabel = new Date(currentDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
  useDocumentTitle('Schedule')

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-pitch uppercase tracking-[0.2em] mb-8 text-center">
        Full Schedule
      </p>

      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="w-11 h-11 rounded-full bg-navy text-chalk text-lg flex items-center justify-center disabled:opacity-30 hover:bg-navy/90 transition-opacity"
        >
          ‹
        </button>

        <div className="text-center">
          <p className="font-display text-3xl text-navy">{dateLabel}</p>
          {isToday && (
            <span className="bg-gold text-navy text-xs font-mono font-semibold px-3 py-0.5 rounded-full inline-block mt-2">
              Today
            </span>
          )}
        </div>

        <button
          onClick={() => setCurrentIndex((i) => Math.min(dates.length - 1, i + 1))}
          disabled={currentIndex === dates.length - 1}
          className="w-11 h-11 rounded-full bg-navy text-chalk text-lg flex items-center justify-center disabled:opacity-30 hover:bg-navy/90 transition-opacity"
        >
          ›
        </button>
      </div>

      <div className="bg-chalk rounded-2xl border border-navy/10 overflow-hidden shadow-sm">
        {grouped[currentDate].map((match) => (
          <MatchRow
            key={match.id}
            match={match}
            teams={teams}
            stadiums={stadiums}
            results={results}
          />
        ))}
      </div>
    </div>
  )
}

export default SchedulePage