import knockoutBracket from '../data/knockoutBracket.json'

const LEFT_R32 = ['m74', 'm77', 'm73', 'm75', 'm81', 'm82', 'm83', 'm84']
const LEFT_R16 = ['m89', 'm90', 'm94', 'm93']
const LEFT_QF = ['m97', 'm98']
const LEFT_SF = ['m101']

const RIGHT_R32 = ['m76', 'm78', 'm79', 'm80', 'm85', 'm87', 'm86', 'm88']
const RIGHT_R16 = ['m91', 'm92', 'm96', 'm95']
const RIGHT_QF = ['m99', 'm100']
const RIGHT_SF = ['m102']

function findMatch(id) {
  const all = [
    ...knockoutBracket.roundOf32,
    ...knockoutBracket.roundOf16,
    ...knockoutBracket.quarterFinals,
    ...knockoutBracket.semiFinals,
  ]
  return all.find((m) => m.id === id)
}

function slotLabel(slot) {
  if (slot.type === 'winner') return `W Grp ${slot.group}`
  if (slot.type === 'runnerup') return `RU Grp ${slot.group}`
  if (slot.type === 'thirdplace') return `3rd (${slot.candidateGroups.join('/')})`
  return 'TBD'
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function Row({ team, label }) {
  if (team) {
    return (
      <div className="flex items-center gap-1.5">
        <img
          src={`https://flagcdn.com/w40/${team.flagCode}.png`}
          alt={`${team.name} flag`}
          className="w-4 h-3 object-cover rounded-sm flex-shrink-0"
        />
        <span className="font-display text-xs text-navy truncate">{team.name}</span>
      </div>
    )
  }
  return <span className="font-mono text-[9px] text-navy/40 italic truncate block">{label}</span>
}

function MatchBox({ matchId, resolve }) {
  const match = findMatch(matchId)
  if (!match) return null

  let label1, label2, team1, team2

  if (match.slot1) {
    team1 = resolve(match.slot1, match.id)
    team2 = resolve(match.slot2, match.id)
    label1 = team1 ? null : slotLabel(match.slot1)
    label2 = team2 ? null : slotLabel(match.slot2)
  } else {
    label1 = `W M${match.from1.slice(1)}`
    label2 = `W M${match.from2.slice(1)}`
  }

  return (
    <div className="flex-shrink-0">
      <div className="bg-chalk border border-navy/15 rounded-lg px-2 py-1.5 w-[110px] shadow-sm">
        <Row team={team1} label={label1} />
        <div className="h-px bg-navy/10 my-1" />
        <Row team={team2} label={label2} />
      </div>
      <p className="font-mono text-[9px] text-navy/40 text-center mt-1">
        {formatDate(match.date)}
      </p>
    </div>
  )
}

function Column({ ids, resolve }) {
  return (
    <div className="flex flex-col justify-around gap-2">
      {ids.map((id) => (
        <MatchBox key={id} matchId={id} resolve={resolve} />
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

function Half({ r32, r16, qf, sf, resolve, mirrored }) {
  const parts = [
    <Column key="r32" ids={r32} resolve={resolve} />,
    <Connectors key="c1" fromCount={8} />,
    <Column key="r16" ids={r16} resolve={resolve} />,
    <Connectors key="c2" fromCount={4} />,
    <Column key="qf" ids={qf} resolve={resolve} />,
    <Connectors key="c3" fromCount={2} />,
    <Column key="sf" ids={sf} resolve={resolve} />,
  ]
  return (
    <div className="flex items-stretch">
      {mirrored ? parts.slice().reverse() : parts}
    </div>
  )
}

function BracketView({ resolve }) {
  return (
    <div className="overflow-x-auto pb-6 -mx-6 px-6">
      <div className="flex items-center gap-3 min-w-[1100px]">
        <Half r32={LEFT_R32} r16={LEFT_R16} qf={LEFT_QF} sf={LEFT_SF} resolve={resolve} />

        <div className="flex flex-col items-center gap-2 px-3 flex-shrink-0">
          <span className="text-2xl">🏆</span>
          <p className="font-display text-sm text-navy">Final</p>
          <div className="bg-navy rounded-lg px-3 py-2 w-[130px]">
            <p className="font-mono text-[8px] text-chalk/60 text-center mb-1">
              Jul 19 · MetLife
            </p>
            <p className="font-display text-xs text-gold text-center">
              W M101 vs W M102
            </p>
          </div>
          <div className="bg-chalk border border-navy/15 rounded-lg px-2 py-1.5 w-[130px] text-center">
            <p className="font-mono text-[8px] text-navy/40 uppercase">3rd Place</p>
            <p className="font-mono text-[10px] text-navy/60">L M101 vs L M102</p>
          </div>
        </div>

        <Half
          r32={RIGHT_R32}
          r16={RIGHT_R16}
          qf={RIGHT_QF}
          sf={RIGHT_SF}
          resolve={resolve}
          mirrored
        />
      </div>
    </div>
  )
}

export default BracketView