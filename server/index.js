import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import OpenAI from 'openai'

const app = express()
app.use(cors())
app.use(express.json())

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

app.post('/api/preview', async (req, res) => {
  const { homeTeam, awayTeam, stadiumName, stadiumCity, group } = req.body

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are a football journalist writing short, engaging World Cup match previews for casual fans. Focus on expected playing styles, tactical tendencies, and what makes the match worth watching. Do not invent specific injury news, exact lineups, or recent scores you cannot verify. Keep it to 3-4 sentences.',
        },
        {
          role: 'user',
          content: `Write a preview for the Group ${group} World Cup match between ${homeTeam} and ${awayTeam}, played at ${stadiumName} in ${stadiumCity}.`,
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