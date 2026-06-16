function AIPreview({ text }) {
  return (
    <section id="preview" className="px-6 py-16">
      <div className="max-w-4xl mx-auto bg-navy rounded-2xl p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gold" />
        <p className="font-mono text-xs text-gold uppercase tracking-[0.2em] mb-3">
          🧠 AI Match Preview
        </p>
        <p className="font-body text-chalk/90 leading-relaxed text-lg sm:text-xl">{text}</p>
      </div>
    </section>
  )
}

export default AIPreview