export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { homeTeam, awayTeam, stadiumName, stadiumCity, group } = req.body

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
      }),
    })

    const data = await response.json()
    res.status(200).json({ preview: data.choices[0].message.content })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate preview' })
  }
}