import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import MatchPage from './pages/MatchPage'
import SchedulePage from './pages/SchedulePage'
import StandingsPage from './pages/StandingsPage'
import KnockoutPage from './pages/KnockoutPage'
import TopScorersPage from './pages/TopScorersPage'
import HistoryPage from './pages/HistoryPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <div className="bg-chalk min-h-screen">
      <Header />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match/:id" element={<MatchPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/standings" element={<StandingsPage />} />
        <Route path="/knockout" element={<KnockoutPage />} />
        <Route path="/scorers" element={<TopScorersPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App