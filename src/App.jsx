import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import LoginPage   from './pages/LoginPage'
import HomePage    from './pages/HomePage'
import ResultPage  from './pages/ResultPage'
import HistoryPage from './pages/HistoryPage'
import AboutPage   from './pages/AboutPage'
import TechStackPage from './pages/techstack'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route element={<PrivateRoute />}>
          <Route element={<Navbar />}>
            <Route path="/"        element={<HomePage />} />
            <Route path="/result"  element={<ResultPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/about"   element={<AboutPage />} />
            <Route path="/tech"    element={<TechStackPage />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}