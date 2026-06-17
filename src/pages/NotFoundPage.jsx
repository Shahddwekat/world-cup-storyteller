import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function NotFoundPage() {
  useDocumentTitle('Page Not Found')

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <p className="font-display text-6xl text-gold mb-4">404</p>
      <h1 className="font-display text-3xl text-navy mb-4">Page Not Found</h1>
      <p className="font-body text-navy/60 mb-8">
        This page doesn't exist — maybe the match got moved, or the link's a little offside.
      </p>
      <Link
        to="/"
        className="bg-navy text-chalk font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full hover:bg-navy/90 transition-colors inline-block"
      >
        Back to Home
      </Link>
    </div>
  )
}

export default NotFoundPage