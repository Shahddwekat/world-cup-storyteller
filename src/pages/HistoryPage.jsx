import history from '../data/worldCupHistory.json'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const WINNER_FLAGS = {
  Argentina: 'ar', Brazil: 'br', France: 'fr', Germany: 'de',
  'West Germany': 'de', Italy: 'it', England: 'gb-eng', Spain: 'es',
  Uruguay: 'uy',
}

const RUNNER_FLAGS = {
  Argentina: 'ar', Brazil: 'br', France: 'fr', Germany: 'de',
  'West Germany': 'de', Italy: 'it', Netherlands: 'nl', Croatia: 'hr',
  Hungary: 'hu', Czechoslovakia: 'cz', Sweden: 'se', Uruguay: 'uy',
}

function HistoryPage() {
  useDocumentTitle('World Cup History')

  const titles = {}
  history.forEach((e) => {
    titles[e.winner] = (titles[e.winner] || 0) + 1
  })

  const topWinners = Object.entries(titles)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-pitch uppercase tracking-[0.2em] mb-3 text-center">
        Tournament History
      </p>
      <h1 className="font-display text-4xl text-navy mb-3 text-center">
        World Cup Winners
      </h1>
      <p className="font-body text-navy/60 text-center mb-12">
        Every final result since the first World Cup in 1930.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-14">
        {topWinners.map(([nation, count]) => (
          <div key={nation} className="bg-navy rounded-xl px-5 py-4 text-center min-w-[120px]">
            {WINNER_FLAGS[nation] && (
              <img
                src={`https://flagcdn.com/w80/${WINNER_FLAGS[nation]}.png`}
                alt={`${nation} flag`}
                className="w-10 h-7 object-cover rounded-sm mx-auto mb-2"
              />
            )}
            <p className="font-display text-gold text-2xl">{count}×</p>
            <p className="font-body text-chalk/80 text-sm mt-1">{nation}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {history.map((edition) => (
          <div
            key={edition.year}
            className="bg-chalk border border-navy/10 rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex-shrink-0 text-center sm:text-left sm:w-20">
              <p className="font-display text-3xl text-gold">{edition.year}</p>
              <p className="font-mono text-xs text-navy/50">{edition.host}</p>
            </div>

            <div className="flex items-center gap-3 flex-1 min-w-0">
              {WINNER_FLAGS[edition.winner] && (
                <img
                  src={`https://flagcdn.com/w40/${WINNER_FLAGS[edition.winner]}.png`}
                  alt={`${edition.winner} flag`}
                  className="w-7 h-5 object-cover rounded-sm flex-shrink-0"
                />
              )}
              <div>
                <p className="font-display text-lg text-navy">{edition.winner}</p>
                <p className="font-mono text-xs text-pitch uppercase tracking-wide">Champion</p>
              </div>
            </div>

            <div className="text-center flex-shrink-0 px-4">
              <p className="font-display text-xl text-navy">{edition.score}</p>
              {edition.penalty && (
                <p className="font-mono text-xs text-navy/50">{edition.penalty}</p>
              )}
            </div>

            <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
              <div className="text-right">
                <p className="font-display text-lg text-navy">{edition.runnerUp}</p>
                <p className="font-mono text-xs text-navy/50 uppercase tracking-wide">Runner-up</p>
              </div>
              {RUNNER_FLAGS[edition.runnerUp] && (
                <img
                  src={`https://flagcdn.com/w40/${RUNNER_FLAGS[edition.runnerUp]}.png`}
                  alt={`${edition.runnerUp} flag`}
                  className="w-7 h-5 object-cover rounded-sm flex-shrink-0"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryPage