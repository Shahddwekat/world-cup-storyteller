import { useState } from 'react'
import knockoutStories from '../data/knockoutStories.json'

function MatchFacts({ matchId }) {
  const [open, setOpen] = useState(false)
  const story = knockoutStories[matchId]

  if (!story?.funFacts?.length) return null

  return (
    <div className="mt-4 pt-4 border-t border-navy/10">
      {story.whyItMatters && (
        <p className="font-body text-sm text-navy/70 italic mb-3">{story.whyItMatters}</p>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="font-mono text-[10px] uppercase tracking-wide text-pitch hover:text-navy transition-colors"
        aria-expanded={open}
      >
        {open ? '− Hide facts' : `+ ${story.funFacts.length} fun facts`}
      </button>

      {open && (
        <ul className="mt-3 space-y-2">
          {story.funFacts.map((fact, i) => (
            <li key={i} className="font-body text-sm text-navy/75 leading-relaxed flex gap-2">
              <span className="text-gold flex-shrink-0">◆</span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MatchFacts