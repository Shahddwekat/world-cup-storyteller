import 'dotenv/config'
import fs from 'fs'

const APIFOOTBALL_KEY = process.env.APIFOOTBALL_KEY
const teams = JSON.parse(fs.readFileSync('../src/data/teams.json', 'utf-8'))
const apiIds = JSON.parse(fs.readFileSync('./teamApiFootballIds.json', 'utf-8'))

if (!fs.existsSync('./cache/squads')) fs.mkdirSync('./cache/squads', { recursive: true })

let playerPhotos = {}
try {
  playerPhotos = JSON.parse(fs.readFileSync('../src/data/playerPhotos.json', 'utf-8'))
} catch {}

const NAME_ALIASES = { kor: 'South Korea', cze: 'Czech Republic', tur: 'Turkey' }
function matchesTeamName(ofName, ourName, ourId) {
  const alias = NAME_ALIASES[ourId]
  const normalized = ofName.trim().toLowerCase()
  return normalized === ourName.trim().toLowerCase() || (alias && normalized === alias.toLowerCase())
}

function matchesPlayerName(scorerName, squadPlayerName) {
  const a = scorerName.trim().toLowerCase()
  const b = squadPlayerName.trim().toLowerCase()
  return a === b || b.endsWith(a) || a.endsWith(b) || b.includes(a)
}

async function getSquad(teamId) {
  const cachePath = `./cache/squads/${teamId}.json`
  if (fs.existsSync(cachePath)) {
    return JSON.parse(fs.readFileSync(cachePath, 'utf-8'))
  }
  const res = await fetch(`https://v3.football.api-sports.io/players/squads?team=${teamId}`, {
    headers: { 'x-apisports-key': APIFOOTBALL_KEY },
  })
  const data = await res.json()
  const players = data.response?.[0]?.players || []
  fs.writeFileSync(cachePath, JSON.stringify(players, null, 2))
  console.log(`  fetched squad for team ${teamId} (${players.length} players)`)
  await new Promise((r) => setTimeout(r, 6500))
  return players
}

async function main() {
  const res = await fetch(
    'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'
  )
  const data = await res.json()
  const results = data.matches

  const tally = {}
  results.forEach((fixture) => {
    if (!fixture.score) return
    const homeTeam = teams.find((t) => matchesTeamName(fixture.team1, t.name, t.id))
    const awayTeam = teams.find((t) => matchesTeamName(fixture.team2, t.name, t.id))

    const addGoals = (goalsArr, team) => {
      ;(goalsArr || []).forEach((g) => {
        const key = `${g.name}|${team?.id || 'unknown'}`
        if (!tally[key]) tally[key] = { name: g.name, team }
      })
    }
    addGoals(fixture.goals1, homeTeam)
    addGoals(fixture.goals2, awayTeam)
  })

  const scorers = Object.values(tally)
  console.log(`Found ${scorers.length} unique scorers.\n`)

  for (const scorer of scorers) {
    if (!scorer.team) continue
    const key = `${scorer.name}|${scorer.team.id}`
    if (playerPhotos[key]) continue

    const apiId = apiIds[scorer.team.id]
    if (!apiId) continue

    const squad = await getSquad(apiId)
    const player = squad.find((p) => matchesPlayerName(scorer.name, p.name))

    if (player) {
      playerPhotos[key] = { photo: player.photo, age: player.age }
      console.log(`  matched ${scorer.name} -> ${player.name}, age ${player.age}`)
    } else {
      console.log(`  could not match player: ${scorer.name} in ${scorer.team.name} squad`)
    }
  }

  fs.writeFileSync('../src/data/playerPhotos.json', JSON.stringify(playerPhotos, null, 2))
  console.log('\nSaved playerPhotos.json')
}

main()