import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — World Cup Storyteller` : 'World Cup Storyteller'
  }, [title])
}