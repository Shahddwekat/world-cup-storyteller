import { Link } from 'react-router-dom'

const FEATURES = [
  {
    emoji: '🏟',
    title: 'Stadium Guide',
    description: 'Know every venue and its history, from Estadio Azteca to MetLife Stadium.',
    to: '/schedule',
  },
  {
    emoji: '🔥',
    title: 'Rivalries & History',
    description: 'Classic matchups, historic upsets, and the stories behind them.',
    to: '/#matches',
  },
  {
    emoji: '⭐',
    title: 'Players to Watch',
    description: 'Top stars and rising talents leading the tournament scoring charts.',
    to: '/scorers',
  },
]

function FeatureCards() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {FEATURES.map((feature) => (
          <Link
            key={feature.title}
            to={feature.to}
            className="bg-navy rounded-2xl p-6 border border-transparent hover:border-gold/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
          >
            <span className="text-3xl">{feature.emoji}</span>
            <h3 className="font-display text-xl text-gold mt-3 mb-2">{feature.title}</h3>
            <p className="font-body text-sm text-chalk/70 leading-relaxed">
              {feature.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default FeatureCards