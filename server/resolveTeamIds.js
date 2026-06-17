import 'dotenv/config'
import fs from 'fs'

const API_KEY = process.env.APIFOOTBALL_KEY
const teams = JSON.parse(fs.readFileSync('../src/data/teams.json', 'utf-8'))

const NAME_OVERRIDES = {
  kor: 'South Korea',
  cze: 'Czech',
  tur: 'Turkey',
  cod: 'DR Congo',
  civ: 'Ivory Coast',
  cuw: 'Curacao',
  bih: 'Bosnia',
}

let existing = {}
try {
  existing = JSON.parse(fs.readFileSync('./teamApiFootballIds.json', 'utf-8'))
} catch {
  // no existing file yet, that's fine
}

async function resolveTeam(team) {
  const searchName = NAME_OVERRIDES[team.id] || team.name
  const res = await fetch(
    `https://v3.football.api-sports.io/teams?search=${encodeURIComponent(searchName)}`,
    { headers: { 'x-apisports-key': API_KEY } }
  )
  const data = await res.json()

  if (data.errors && Object.keys(data.errors).length > 0) {
    const errorText = JSON.stringify(data.errors).toLowerCase()
    const isRateLimit =
      errorText.includes('rate') || errorText.includes('limit') || errorText.includes('quota')
    console.log(`ERROR on ${team.name}:`, data.errors)
    return { id: null, rateLimited: isRateLimit }
  }

  const match = data.response?.find((r) => r.team.national === true)

  if (!match) {
    console.log(`NOT FOUND: ${team.name} (searched "${searchName}")`)
    return { id: null, rateLimited: false }
  }

  console.log(`${team.name} -> id ${match.team.id}`)
  return { id: match.team.id, rateLimited: false }
}

async function main() {
  const result = { ...existing }
  const remaining = teams.filter((t) => !result[t.id])

  console.log(`Already have ${Object.keys(result).length} teams. ${remaining.length} left to resolve.\n`)

  for (const team of remaining) {
    const { id, rateLimited } = await resolveTeam(team)
    if (id) result[team.id] = id

    fs.writeFileSync('./teamApiFootballIds.json', JSON.stringify(result, null, 2))

    if (rateLimited) {
      console.log('\nActually hit a rate limit this time — stopping early. Run the script again later to continue.')
      break
    }

    await new Promise((r) => setTimeout(r, 6500))
  }

  console.log(`\nSaved ${Object.keys(result).length} of ${teams.length} teams.`)
}

main()