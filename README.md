
```markdown
#  World Cup Storyteller

An AI-powered companion for the 2026 FIFA World Cup that turns matches into simple, engaging stories for casual fans, skip the spreadsheets, get the stadium, the rivalry, the players to watch, and what to expect, in under a minute.

**Live site:** [world-cup-storyteller.vercel.app](https://world-cup-storyteller.vercel.app)

## Features

- **Home page** : hero section and a live grid of upcoming matches, automatically rotating based on the current date
- **Match Story pages** : stadium info, why the match matters, players to watch, head-to-head history, fun facts, and an AI-generated tactical preview for every one of the 72 group-stage matches
- **Full Schedule** : day-by-day match list with prev/next navigation, jumping straight to today's matches
- **Live Standings** : group tables computed live from real match results, no hardcoded data
- **Knockout Bracket** : a Round of 32 → Final bracket that automatically fills in qualified teams as groups finish, with both a visual bracket view and a list view
- **Top Scorers** : live-updating goal leaderboard with player photos and ages where available
- **Real-time data** : final scores, group standings, and goal scorers update automatically as matches are played
- **Mobile responsive** throughout

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS v4
- React Router

**AI**
- [Groq](https://groq.com) (Llama 3.3 70B) for on-demand AI match previews, served via a Vercel serverless function so the API key never reaches the browser

**Data Sources**
- [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json) — free, public-domain live results, goals, and scorers (updated roughly daily)
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
