import 'dotenv/config'
import fs from 'fs'
import OpenAI from 'openai'

const APIFOOTBALL_KEY = process.env.APIFOOTBALL_KEY
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

const matches = JSON.parse(fs.readFileSync('../src/data/matches.json', 'utf-8'))
const teams = JSON.parse(fs.readFileSync('../src/data/teams.json', 'utf-8'))
const apiIds = JSON.parse(fs.readFileSync('./teamApiFootballIds.json', 'utf-8'))
const stadiums = JSON.parse(fs.readFileSync('../src/data/stadiums.json', 'utf-8'))

let matchStories = {}
try {
  matchStories = JSON.parse(fs.readFileSync('../src/data/matchStories.json', 'utf-8'))
} catch {}

if (!fs.existsSync('./cache/squads')) fs.mkdirSync('./cache/squads', { recursive: true })
if (!fs.existsSync('./cache/h2h')) fs.mkdirSync('./cache/h2h', { recursive: true })

async function apiFootballFetch(endpoint) {
  const res = await fetch(`https://v3.football.api-sports.io/${endpoint}`, {
    headers: { 'x-apisports-key': APIFOOTBALL_KEY },
  })
  return res.json()
}

async function getSquad(teamId) {
  const cachePath = `./cache/squads/${teamId}.json`
  if (fs.existsSync(cachePath)) {
    return JSON.parse(fs.readFileSync(cachePath, 'utf-8'))
  }
  const data = await apiFootballFetch(`players/squads?team=${teamId}`)
  const players = data.response?.[0]?.players || []
  fs.writeFileSync(cachePath, JSON.stringify(players, null, 2))
  console.log(`  fetched squad for team ${teamId} (${players.length} players)`)
  return players
}

async function getHeadToHead(id1, id2) {
  const key = [id1, id2].sort().join('-')
  const cachePath = `./cache/h2h/${key}.json`
  if (fs.existsSync(cachePath)) {
    return JSON.parse(fs.readFileSync(cachePath, 'utf-8'))
  }
  const data = await apiFootballFetch(`fixtures/headtohead?h2h=${id1}-${id2}&last=5`)
  const fixtures = data.response || []
  fs.writeFileSync(cachePath, JSON.stringify(fixtures, null, 2))
  console.log(`  fetched head-to-head for ${id1} vs ${id2} (${fixtures.length} fixtures)`)
  return fixtures
}

function summarizeSquad(players) {
  return players.map((p) => `${p.name} (${p.position}, age ${p.age})`).join(', ')
}

function summarizeH2H(fixtures) {
  if (!fixtures.length) return 'No previous meetings found in the data we have access to.'
  return fixtures
    .map((f) => {
      const date = f.fixture.date.split('T')[0]
      const home = f.teams.home.name
      const away = f.teams.away.name
      const score = `${f.goals.home}-${f.goals.away}`
      const league = f.league.name
      return `${date}: ${home} ${score} ${away} (${league})`
    })
    .join('\n')
}

async function generateStory(matchId) {
  const match = matches.find((m) => m.id === matchId)
  if (!match) {
    console.log(`Match ${matchId} not found`)
    return
  }

  const home = teams.find((t) => t.id === match.homeTeam)
  const away = teams.find((t) => t.id === match.awayTeam)
  const stadium = stadiums.find((s) => s.id === match.stadium)
  const homeApiId = apiIds[home.id]
  const awayApiId = apiIds[away.id]

  console.log(`\nGenerating story for ${home.name} vs ${away.name}...`)

  const homeSquad = await getSquad(homeApiId)
  const awaySquad = await getSquad(awayApiId)
  const h2h = await getHeadToHead(homeApiId, awayApiId)

  const prompt = `You are writing structured content for a World Cup match story page, aimed at casual football fans. Use ONLY the real facts provided below — do not invent player names, scores, or events not present in this data.

MATCH: ${home.name} vs ${away.name}, Group ${match.group}, ${stadium.name} in ${stadium.city}, ${match.date}.

${home.name} SQUAD: ${summarizeSquad(homeSquad)}

${away.name} SQUAD: ${summarizeSquad(awaySquad)}

HEAD-TO-HEAD HISTORY (most recent meetings; may be empty if these teams rarely played):
${summarizeH2H(h2h)}

Respond with ONLY valid JSON (no markdown, no commentary) in this exact shape:
{
  "whyItMatters": "2-3 sentences on tournament context",
  "players": [
    { "teamId": "${home.id}", "name": "<real name from squad above>", "role": "<position>", "blurb": "1 sentence" },
    { "teamId": "${home.id}", "name": "<real name from squad above>", "role": "<position>", "blurb": "1 sentence" },
    { "teamId": "${away.id}", "name": "<real name from squad above>", "role": "<position>", "blurb": "1 sentence" },
    { "teamId": "${away.id}", "name": "<real name from squad above>", "role": "<position>", "blurb": "1 sentence" }
  ],
  "headToHead": {
    "summary": "1-2 sentence summary based on the data above, or note if there's no history",
    "meetings": [ { "date": "YYYY-MM-DD", "competition": "...", "result": "Team A X-Y Team B", "note": "1 sentence" } ]
  },
  "funFacts": ["fact 1", "fact 2", "fact 3"],
  "aiPreview": "3-4 sentence tactical preview paragraph"
}`

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1200,
    response_format: { type: 'json_object' },
  })

  let story
  try {
    story = JSON.parse(completion.choices[0].message.content)
  } catch (err) {
    console.log('Failed to parse Groq response as JSON:', completion.choices[0].message.content)
    return
  }

  matchStories[matchId] = story
  fs.writeFileSync('../src/data/matchStories.json', JSON.stringify(matchStories, null, 2))
  console.log(`Saved story for ${matchId}`)
}

const matchIdsToProcess = process.argv.slice(2)
if (matchIdsToProcess.length === 0) {
  console.log('Usage: node generateStory.js m1 m2 m3 ...')
  process.exit(1)
}

async function main() {
  for (const id of matchIdsToProcess) {
    await generateStory(id)
    await new Promise((r) => setTimeout(r, 6500))
  }
}

main()