
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Home from './pages/Home'
import Layout from './components/Layout'
import UsersPage from './pages/UsersPage'
import TeamsPage from './pages/TeamsPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path='/*' element={<Layout>
          <Routes>
            <Route path="home" element={<Home />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="dashboard" element={<Home />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Layout>}
        />
      </Routes>
    </>
  )
}

export default App