
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout'
import UsersPage from './pages/UsersPage'
import TeamsPage from './pages/TeamsPage'
import DashboardPage from './pages/Dashboard'
import SettingsPage from './pages/SettingsPage'
import JudgesPage from './pages/JudgesPage'
import AssignJudgePage from './pages/AssignJudgePage'
import UnassignedTeamsPage from './pages/UnassignedTeamsPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path='/*' element={<Layout>
          <Routes>
            <Route path="users" element={<UsersPage />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path='settings' element={<SettingsPage />} />
            <Route path='judges' element={<JudgesPage/>}/>
            <Route path='assign-judge' element={<AssignJudgePage/>}/>
            <Route path='unassign-teams' element={<UnassignedTeamsPage/>}/>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>}
        />
      </Routes>
    </>
  )
}

export default App