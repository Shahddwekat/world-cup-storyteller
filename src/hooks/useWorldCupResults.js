import { useEffect, useState } from 'react'

let cachedData = null
let cachedPromise = null

function fetchResults() {
  if (cachedData) return Promise.resolve(cachedData)
  if (cachedPromise) return cachedPromise

  cachedPromise = fetch(
    'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'
  )
    .then((res) => res.json())
    .then((data) => {
      cachedData = data.matches
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