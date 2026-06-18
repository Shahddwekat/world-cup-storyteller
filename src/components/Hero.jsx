import logo from '../assets/logo.png'

function Hero() {
  return (
    <section className="bg-navy min-h-[calc(100vh-88px)] sm:min-h-[calc(100vh-112px)] flex flex-col items-center justify-center text-center px-6 py-8">
      <img
        src={logo}
        alt="World Cup Storyteller"
        className="h-28 sm:h-40 w-auto mb-6 drop-shadow-[0_0_30px_rgba(228,181,73,0.3)]"
      />

      <span className="font-mono text-xs sm:text-sm text-gold uppercase tracking-[0.2em] border border-gold/40 rounded-full px-3 py-1 mb-4">
        FIFA World Cup 2026
      </span>

      <h1 className="font-display text-2xl sm:text-4xl text-chalk tracking-wide leading-tight">
        Every Match
        <br />
        <span className="text-gold">Has a Story</span>
      </h1>

      <p className="font-body text-chalk/70 max-w-md mt-3 text-sm sm:text-base">
        Skip the spreadsheets. Get the stadium, the rivalry, the players to
        watch, and what to expect — in under a minute.
      </p>

      <div className="w-12 h-1 bg-pitch rounded-full mt-5" />
    </section>
  )
}

export default Hero