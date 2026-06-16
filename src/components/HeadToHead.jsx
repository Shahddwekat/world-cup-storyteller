function HeadToHead({ data }) {
  return (
    <section id="history" className="bg-navy px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs text-gold uppercase tracking-[0.2em] mb-6">
          Head-to-Head History
        </p>

        <p className="font-body text-chalk/80 leading-relaxed text-lg mb-8">{data.summary}</p>

        <div className="space-y-6">
          {data.meetings.map((m, i) => (
            <div
              key={i}
              className="bg-chalk/5 border border-gold/20 rounded-2xl px-6 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <p className="font-mono text-xs text-chalk/50">
                  {m.competition} · {m.date}
                </p>
                <p className="font-display text-3xl text-gold mt-1">{m.result}</p>
              </div>
              <p className="font-body text-sm text-chalk/70 sm:max-w-sm">{m.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeadToHead