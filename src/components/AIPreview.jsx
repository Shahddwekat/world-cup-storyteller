import { useState } from 'react'

function AIPreview({ text, matchContext }) {
  const [preview, setPreview] = useState(text || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generatePreview = async () => {
    setLoading(true)
    setError(null)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${apiUrl}/api/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchContext),
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setPreview(data.preview)
    } catch (err) {
      setError('Could not generate a preview right now. Try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="preview" className="px-6 py-16">
      <div className="max-w-4xl mx-auto bg-navy rounded-2xl p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gold" />
        <p className="font-mono text-xs text-gold uppercase tracking-[0.2em] mb-3">
          🧠 AI Match Preview
        </p>

        {preview ? (
          <p className="font-body text-chalk/90 leading-relaxed text-lg sm:text-xl">
            {preview}
          </p>
        ) : (
          <div>
            <p className="font-body text-chalk/60 mb-4">
              No preview written for this match yet — generate one now.
            </p>
            <button
              onClick={generatePreview}
              disabled={loading}
              className="bg-gold text-navy font-mono text-sm uppercase tracking-wide px-5 py-2 rounded-full hover:bg-gold/90 disabled:opacity-50 transition-opacity"
            >
              {loading ? 'Generating…' : 'Generate AI Preview'}
            </button>
            {error && <p className="text-red-300 text-sm mt-3">{error}</p>}
          </div>
        )}
      </div>
    </section>
  )
}

export default AIPreview