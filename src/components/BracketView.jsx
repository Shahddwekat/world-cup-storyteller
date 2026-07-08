import teams from '../data/teams.json'
import { resolveParticipants, formatScore, getWinner, getKnockoutMatch } from '../utils/knockoutResults'

const LEFT_R32 = ['m74', 'm77', 'm73', 'm75', 'm81', 'm82', 'm83', 'm84']
const LEFT_R16 = ['m89', 'm90', 'm94', 'm93']
const LEFT_QF = ['m97', 'm98']
const LEFT_SF = ['m101']

const RIGHT_R32 = ['m76', 'm78', 'm79', 'm80', 'm85', 'm87', 'm86', 'm88']
const RIGHT_R16 = ['m91', 'm92', 'm96', 'm95']
const RIGHT_QF = ['m99', 'm100']
const RIGHT_SF = ['m102']

const teamById = Object.fromEntries(teams.map((t) => [t.id, t]))

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function Row({ team, fallback, isWinner, played }) {
  if (!team) {
    return (
      <span className="font-mono text-[9px] text-navy/40 italic truncate block">{fallback}</span>
    )
  }
  return (
    <div className={`flex items-center gap-1.5 ${played && !isWinner ? 'opacity-45' : ''}`}>
      <img
        src={`https://flagcdn.com/w40/${team.flagCode}.png`}
        alt={`${team.name} flag`}
        className="w-4 h-3 object-cover rounded-sm flex-shrink-0"
      />
      <span
        className={`font-display text-xs truncate ${isWinner ? 'text-pitch font-bold' : 'text-navy'}`}
      >
        {team.name}
      </span>
    </div>
  )
}

function MatchBox({ matchId }) {
  const rec = getKnockoutMatch(matchId)
  const [id1, id2] = resolveParticipants(matchId)
  const team1 = id1 ? teamById[id1] : null
  const team2 = id2 ? teamById[id2] : null
  const winner = getWinner(matchId)
  const score = formatScore(matchId)
  const played = Boolean(score)

  return (
    <div className="flex-shrink-0">
      <div className="bg-chalk border border-navy/15 rounded-lg px-2 py-1.5 w-[118px] shadow-sm">
        <Row team={team1} fallback="TBD" isWinner={played && winner === id1} played={played} />
        <div className="h-px bg-navy/10 my-1" />
        <Row team={team2} fallback="TBD" isWinner={played && winner === id2} played={played} />
      </div>
      <p className="font-mono text-[9px] text-navy/50 text-center mt-1">
        {score || (rec ? formatDate(rec.date) : '')}
      </p>
    </div>
  )
}

function Column({ ids }) {
  return (
    <div className="flex flex-col justify-around gap-2">
      {ids.map((id) => (
        <MatchBox key={id} matchId={id} />
      ))}
    </div>
  )
}

function Connectors({ fromCount }) {
  const toCount = fromCount / 2
  const lines = []
  for (let j = 0; j < toCount; j++) {
    lines.push({
      top: ((2 * j + 0.5) / fromCount) * 100,
      bottom: ((2 * j + 1.5) / fromCount) * 100,
      mid: ((2 * j + 1) / fromCount) * 100,
    })
  }

  return (
    <div className="relative w-6 flex-shrink-0">
      <svg
        className="absolute inset-0 w-full h-full text-navy/25"
        preserveAspectRatio="none"
        viewBox="0 0 24 100"
      >
        {lines.map((l, i) => (
          <g key={i} stroke="currentColor" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke">
            <line x1="0" y1={l.top} x2="12" y2={l.top} />
            <line x1="0" y1={l.bottom} x2="12" y2={l.bottom} />
            <line x1="12" y1={l.top} x2="12" y2={l.bottom} />
            <line x1="12" y1={l.mid} x2="24" y2={l.mid} />
          </g>
        ))}
      </svg>
    </div>
  )
}

function Half({ r32, r16, qf, sf, mirrored }) {
  const parts = [
    <Column key="r32" ids={r32} />,
    <Connectors key="c1" fromCount={8} />,
    <Column key="r16" ids={r16} />,
    <Connectors key="c2" fromCount={4} />,
    <Column key="qf" ids={qf} />,
    <Connectors key="c3" fromCount={2} />,
    <Column key="sf" ids={sf} />,
  ]
  return <div className="flex items-stretch">{mirrored ? parts.slice().reverse() : parts}</div>
}

function FinalBox() {
  const [id1, id2] = resolveParticipants('m104')
  const team1 = id1 ? teamById[id1] : null
  const team2 = id2 ? teamById[id2] : null
  const winner = getWinner('m104')
  const score = formatScore('m104')
  const name = (t, id) =>
    t ? (
      <span className={winner === id ? 'text-gold font-bold' : 'text-chalk/90'}>{t.name}</span>
    ) : (
      <span className="text-chalk/50">TBD</span>
    )
  return (
    <div className="bg-navy rounded-lg px-3 py-2 w-[140px]">
      <p className="font-mono text-[8px] text-chalk/60 text-center mb-1">Jul 19 · MetLife</p>
      <p className="font-display text-xs text-center">
        {name(team1, id1)} <span className="text-chalk/40">vs</span> {name(team2, id2)}
      </p>
      {score && <p className="font-mono text-[10px] text-gold text-center mt-1">{score}</p>}
    </div>
  )
}

function BracketView() {
  return (
    <div className="overflow-x-auto pb-6 -mx-6 px-6">
      <div className="flex items-center gap-3 min-w-[1160px]">
        <Half r32={LEFT_R32} r16={LEFT_R16} qf={LEFT_QF} sf={LEFT_SF} />

        <div className="flex flex-col items-center gap-2 px-3 flex-shrink-0">
          <span className="text-2xl">🏆</span>
          <p className="font-display text-sm text-navy">Final</p>
          <FinalBox />
          <div className="bg-chalk border border-navy/15 rounded-lg px-2 py-1.5 w-[140px] text-center">
            <p className="font-mono text-[8px] text-navy/40 uppercase">3rd Place</p>
            <MatchBoxInline id="m103" />
          </div>
        </div>

        <Half r32={RIGHT_R32} r16={RIGHT_R16} qf={RIGHT_QF} sf={RIGHT_SF} mirrored />
      </div>
    </div>
  )
}

function MatchBoxInline({ id }) {
  const [id1, id2] = resolveParticipants(id)
  const t1 = id1 ? teamById[id1] : null
  const t2 = id2 ? teamById[id2] : null
  const score = formatScore(id)
  const label = `${t1 ? t1.name : 'TBD'} vs ${t2 ? t2.name : 'TBD'}`
  return (
    <p className="font-mono text-[10px] text-navy/60">
      {label}
      {score ? ` · ${score}` : ''}
    </p>
  )
}

export default BracketView