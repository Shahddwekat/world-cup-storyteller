function WhyItMatters({ content, rivalry }) {
  return (
    <section id="why" className="bg-pitch/5 px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs text-pitch uppercase tracking-[0.2em] mb-3">
          Why This Match Matters
        </p>
        <p className="font-display text-2xl sm:text-3xl text-navy leading-snug border-l-4 border-gold pl-5">
          {content}
        </p>
        {rivalry && (
          <p className="font-body text-navy/70 leading-relaxed mt-6">{rivalry}</p>
        )}
      </div>
    </section>
  )
}

export default WhyItMatters