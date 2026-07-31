#  World Cup Storyteller

An AI-powered companion for the 2026 FIFA World Cup that turns matches into simple, engaging stories for casual fans, skip the spreadsheets, get the stadium, the rivalry, the players to watch, and what to expect, in under a minute.

The tournament has concluded: **Spain beat Argentina 1-0 after extra time in the final to win their second World Cup.** The site now reflects the completed tournament end to end.

**Live site:** [world-cup-storyteller.vercel.app](https://world-cup-storyteller.vercel.app)

## Features

- **Home page** : hero section; shows a grid of upcoming matches while the tournament is live, and switches to a champions banner once the final is decided
- **Match Story pages** : stadium info, why the match matters, players to watch, head-to-head history, and fun facts. Group-stage pages also offer an on-demand, AI-generated tactical preview; knockout pages show the final score and shootout result
- **Full Schedule** : day-by-day match list (group stage through the final) with prev/next navigation, opening on the nearest date
- **Standings** : group tables computed from the match results rather than stored as static tables
- **Knockout Bracket** : a Round of 32 → Final bracket with real results, winners (including penalty shootouts) resolved and propagated, in both a visual bracket view and a list view
- **Top Scorers** : goal leaderboard across the group stage and knockouts, own goals excluded, with player photos and ages where available
- **Data model** : results, standings, and scorers are baked into static JSON at build time from the sources below. The site is a static snapshot — it updates when the data files are refreshed and the site is redeployed, not automatically in the browser
- **Mobile responsive** throughout

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS v4
- React Router

**AI**
- [Groq](https://groq.com) (Llama 3.3 70B) for on-demand AI match previews, served via a Vercel serverless function so the API key never reaches the browser

**Data Sources**
- [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json) — free, public-domain results, goals, and scorers (the upstream project updates roughly daily; this site bakes in a snapshot at build time)
- [API-Football](https://www.api-football.com) — squad rosters, player photos/ages, and head-to-head history, used by offline scripts that bake results into static JSON rather than being called live

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:3001
```

To run the AI preview feature locally, also start the local backend (used only in development — production uses the Vercel serverless function instead):

```bash
cd server
npm install
node index.js
```

`server/.env` needs:

```
GROQ_API_KEY=your_groq_key
```

## Content Generation Scripts

These are one-off Node scripts (run manually, not part of the live app) that fetch real data from API-Football and use Groq to write structured story content, caching results so they're never re-fetched:

```bash
cd server
node resolveTeamIds.js      # one-time: map team codes to API-Football IDs
node generateStory.js m23   # generate full story content for a specific match
node generateTopScorers.js  # fetch photos/ages for current top scorers
```

Results are written into `src/data/matchStories.json` and `src/data/playerPhotos.json`.

## Deployment

The frontend and the `/api/preview` serverless function both deploy together to Vercel from this single repository. Required environment variable on Vercel:

```
GROQ_API_KEY=your_groq_key
```

## Project Structure

```
src/
  components/   reusable UI pieces (MatchCard, Hero, Header, etc.)
  pages/        route-level pages (Home, MatchPage, SchedulePage, etc.)
  data/         static JSON: fixtures, teams, stadiums, stories
  hooks/        useWorldCupResults, useDocumentTitle
  utils/        standings, knockout bracket logic, timezone conversion
api/
  preview.js    Vercel serverless function for AI previews
server/         local dev backend + offline content-generation scripts
```

## Acknowledgments

Match data courtesy of [openfootball](https://github.com/openfootball/worldcup.json). Squad and history data courtesy of [API-Football](https://www.api-football.com). AI previews powered by [Groq](https://groq.com).
```