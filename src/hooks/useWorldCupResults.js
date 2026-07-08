import overrides from '../data/resultsOverride.json'

export function useWorldCupResults() {
  return { results: overrides.matches, loading: false }
}