import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import OpenAI from 'openai'
import { readFileSync } from 'fs'

const matches = JSON.parse(readFileSync(new URL('../src/data/matches.json', import.meta.url)))
const teams = JSON.parse(readFileSync(new URL('../src/data/teams.json', import.meta.url)))
const stadiums = JSON.parse(readFileSync(new URL('../src/data/stadiums.json', import.meta.url)))

const SYSTEM_PROMPT =
  'You are a football journalist writing short, engaging World Cup match previews for casual fans. ' +
  'Focus on expected playing styles, tactical tendencies, and what makes the match worth watching. ' +
  'Do not invent specific injury news, exact lineups, or recent scores you cannot verify. Keep it to 3-4 sentences.'

const app = express()
app.use(cors())
app.use(express.json())

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

app.post('/api/preview', async (req, res) => {
  const { matchId } = req.body || {}
  if (typeof matchId !== 'string') {
    return res.status(400).json({ error: 'matchId is required' })
  }

  const match = matches.find((m) => m.id === matchId)
  if (!match) {
    return res.status(404).json({ error: 'Unknown match' })
  }

  const home = teams.find((t) => t.id === match.homeTeam)
  const away = teams.find((t) => t.id === match.awayTeam)
  const stadium = stadiums.find((s) => s.id === match.stadium)
  if (!home || !away || !stadium) {
    return res.status(500).json({ error: 'Match data incomplete' })
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Write a preview for the Group ${match.group} World Cup match between ${home.name} and ${away.name}, played at ${stadium.name} in ${stadium.city}.`,
        },
      ],
      max_tokens: 220,
    })

    res.json({ preview: completion.choices[0].message.content })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate preview' })
  }
})

app.listen(3001, () => console.log('Server running on http://localhost:3001'))