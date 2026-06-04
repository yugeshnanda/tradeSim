import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProgressProvider } from './context/ProgressContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Markets from './pages/Markets'
import Leaderboard from './pages/Leaderboard'
import Pricing from './pages/Pricing'
import Learn from './pages/Learn'
import TradeHistory from './pages/TradeHistory'
import EmailCapture from './components/EmailCapture'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/learn" element={<Learn />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trade-history"
              element={
                <ProtectedRoute>
                  <TradeHistory />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
        {/* Email capture modal — fires 30s after first visit */}
        <EmailCapture />
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
