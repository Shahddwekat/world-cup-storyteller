import { useEffect, useState } from 'react'
import overrides from '../data/resultsOverride.json'

let cachedData = null
let cachedPromise = null

function mergeResults(liveMatches, overrideMatches) {
  const result = [...(liveMatches || [])]
  const normalize = (s) => s?.toLowerCase().trim()

  overrideMatches.forEach((override) => {
    const existingIndex = result.findIndex(
      (m) =>
        m.date === override.date &&
        normalize(m.team1) === normalize(override.team1) &&
        normalize(m.team2) === normalize(override.team2)
    )
    if (existingIndex >= 0) {
      result[existingIndex] = { ...result[existingIndex], ...override }
    } else {
      result.push(override)
    }
  })

  return result
}

function fetchResults() {
  if (cachedData) return Promise.resolve(cachedData)
  if (cachedPromise) return cachedPromise

  cachedPromise = fetch(
    'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'
  )
    .then((res) => res.json())
    .then((data) => {
      cachedData = mergeResults(data.matches, overrides.matches)
      return cachedData
    })
    .catch(() => {
      cachedData = mergeResults([], overrides.matches)
      return cachedData
    })

  return cachedPromise
}

export function useWorldCupResults() {
  const [results, setResults] = useState(cachedData)
  const [loading, setLoading] = useState(!cachedData)

  useEffect(() => {
    if (cachedData) {
      setResults(cachedData)
      setLoading(false)
      return
    }

    let cancelled = false
    fetchResults()
      .then((data) => {
        if (!cancelled) setResults(data)
      })
      .catch((err) => console.error('Could not fetch World Cup results', err))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { results, loading }
}