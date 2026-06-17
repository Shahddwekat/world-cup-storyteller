import teams from '../data/teams.json'
import matches from '../data/matches.json'
import { useWorldCupResults } from '../hooks/useWorldCupResults'
import { computeStandings } from '../utils/standings'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function StandingsPage() {
  useDocumentTitle('Standings')
  const { results, loading } = useWorldCupResults()

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="font-body text-navy/60">Loading standings…</p>
      </div>
    )
  }

  const standings = computeStandings(matches, teams, results)

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-pitch uppercase tracking-[0.2em] mb-3">
        Group Stage
      </p>
      <h1 className="font-display text-4xl text-navy mb-3">Standings</h1>
      <p className="font-body text-navy/60 mb-10 max-w-2xl">
        Top 2 from each group, plus the 8 best third-placed teams, advance to the Round of 32.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(standings).map(([groupLetter, teamRecords]) => (
          <div key={groupLetter} className="bg-chalk border border-navy/10 rounded-2xl overflow-hidden">
            <div className="bg-navy px-5 py-3">
              <h2 className="font-display text-xl text-gold">Group {groupLetter}</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="font-mono text-xs text-navy/50 uppercase">
                    <th className="text-left px-4 py-2">Team</th>
                    <th className="px-2 py-2">P</th>
                    <th className="px-2 py-2">W</th>
                    <th className="px-2 py-2">D</th>
                    <th className="px-2 py-2">L</th>
                    <th className="px-2 py-2">GD</th>
                    <th className="px-2 py-2">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {teamRecords.map((record, i) => (
                    <tr
                      key={record.team.id}
                      className={`border-t border-navy/10 ${i < 2 ? 'bg-pitch/5' : ''}`}
                    >
                      <td className="px-4 py-2 flex items-center gap-2 font-body text-navy whitespace-nowrap">
                        <img
                          src={`https://flagcdn.com/w40/${record.team.flagCode}.png`}
                          alt={`${record.team.name} flag`}
                          className="w-5 h-3.5 object-cover rounded-sm"
                        />
                        {record.team.name}
                      </td>
                      <td className="text-center px-2 py-2 font-mono text-navy/80">{record.played}</td>
                      <td className="text-center px-2 py-2 font-mono text-navy/80">{record.won}</td>
                      <td className="text-center px-2 py-2 font-mono text-navy/80">{record.drawn}</td>
                      <td className="text-center px-2 py-2 font-mono text-navy/80">{record.lost}</td>
                      <td className="text-center px-2 py-2 font-mono text-navy/80">{record.gd}</td>
                      <td className="text-center px-2 py-2 font-mono font-bold text-navy">{record.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StandingsPage