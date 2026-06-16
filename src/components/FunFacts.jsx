function FunFacts({ facts }) {
  return (
    <section id="facts" className="px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs text-pitch uppercase tracking-[0.2em] mb-8">
          Fun Facts
        </p>

        <div className="flex gap-5 overflow-x-auto pb-2 -mx-1 px-1">
          {facts.map((fact, i) => (
            <div
              key={i}
              className="min-w-[260px] max-w-[280px] bg-chalk border-t-4 border-gold rounded-b-xl shadow-md px-6 py-6 flex-shrink-0"
            >
              <span className="font-display text-4xl text-gold leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="font-body text-sm text-navy/80 leading-relaxed mt-4">{fact}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FunFacts