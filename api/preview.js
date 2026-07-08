import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const matches = require('../src/data/matches.json')
const teams = require('../src/data/teams.json')
const stadiums = require('../src/data/stadiums.json')

const SYSTEM_PROMPT =
  'You are a football journalist writing short, engaging World Cup match previews for casual fans. ' +
  'Focus on expected playing styles, tactical tendencies, and what makes the match worth watching. ' +
  'Do not invent specific injury news, exact lineups, or recent scores you cannot verify. Keep it to 3-4 sentences.'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

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
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Write a preview for the Group ${match.group} World Cup match between ${home.name} and ${away.name}, played at ${stadium.name} in ${stadium.city}.`,
          },
        ],
        max_tokens: 220,
      }),
    })

    const data = await response.json()
    if (!response.ok || !data.choices?.[0]?.message?.content) {
      console.error('Groq error:', data)
      return res.status(502).json({ error: 'Preview service unavailable' })
    }

    res.status(200).json({ preview: data.choices[0].message.content })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate preview' })
  }
}