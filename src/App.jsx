import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import MatchPage from './pages/MatchPage'

function App() {
  return (
    <div className="bg-chalk min-h-screen">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match/:id" element={<MatchPage />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App