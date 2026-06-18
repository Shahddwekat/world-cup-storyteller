function StatsStrip() {
  const stats = [
    { value: '48', label: 'Teams' },
    { value: '104', label: 'Matches' },
    { value: '16', label: 'Stadiums' },
    { value: '3', label: 'Host Nations' },
  ]

  return (
    <section className="bg-chalk border-y border-navy/10 py-6">
      <div className="max-w-4xl mx-auto px-6 flex items-center justify-center divide-x divide-navy/15">
        {stats.map((stat) => (
          <div key={stat.label} className="flex-1 text-center px-2 sm:px-4">
            <p className="font-display text-2xl sm:text-4xl text-navy">{stat.value}</p>
            <p className="font-mono text-[10px] sm:text-xs text-navy/50 uppercase tracking-wide mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StatsStrip