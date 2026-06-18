import logo from '../assets/logo.png'

function Hero() {
  return (
    <section className="bg-navy min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20">
      <img src={logo} alt="World Cup Storyteller" className="h-24 sm:h-32 w-auto mb-8" />

      <span className="font-mono text-sm text-gold uppercase tracking-[0.2em] border border-gold/40 rounded-full px-4 py-1 mb-6">
        FIFA World Cup 2026
      </span>

      <h1 className="font-display text-5xl md:text-7xl text-chalk tracking-wide leading-tight">
        Every Match
        <br />
        <span className="text-gold">Has a Story</span>
      </h1>

      <p className="font-body text-chalk/70 max-w-xl mt-6 text-lg">
        Skip the spreadsheets. Get the stadium, the rivalry, the players to
        watch, and what to expect — in under a minute.
      </p>

      <div className="w-16 h-1 bg-pitch rounded-full mt-10" />
    </section>
  )
}

export default Hero