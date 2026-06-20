import { useEffect, useState } from 'react'
import overrides from '../data/resultsOverride.json'

let cachedData = null

function buildResults() {
  if (cachedData) return cachedData
  cachedData = overrides.matches
  return cachedData
}

export function useWorldCupResults() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setResults(buildResults())
    setLoading(false)
  }, [])

  return { results, loading }
}