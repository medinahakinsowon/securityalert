import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import DashboardLayout from './dashboard/DashboardLayout.jsx'
import Overview from './dashboard/Overview.jsx'
import Alerts from './dashboard/Alerts.jsx'
import Library from './dashboard/Library.jsx'
import Playbooks from './dashboard/Playbooks.jsx'
import Connect from './dashboard/Connect.jsx'
import AdminOverview from './dashboard/AdminOverview.jsx'
import AdminInstitutions from './dashboard/AdminInstitutions.jsx'
import AdminInstitution from './dashboard/AdminInstitution.jsx'
import AdminAlerts from './dashboard/AdminAlerts.jsx'
import Team from './dashboard/Team.jsx'
import Guard, { AdminGuard } from './dashboard/Guard.jsx'
import AcceptInvite from './pages/AcceptInvite.jsx'
import Placeholder from './dashboard/Placeholder.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="alerts" element={<Guard perm="alerts:view"><Alerts /></Guard>} />
        <Route path="library" element={<Library />} />
        <Route path="connect" element={<Guard perm="keys:manage"><Connect /></Guard>} />
        <Route path="team" element={<Guard perm="team:manage"><Team /></Guard>} />
        <Route path="admin" element={<AdminGuard><AdminOverview /></AdminGuard>} />
        <Route path="admin/institutions" element={<AdminGuard><AdminInstitutions /></AdminGuard>} />
        <Route path="admin/institutions/:id" element={<AdminGuard><AdminInstitution /></AdminGuard>} />
        <Route path="admin/alerts" element={<AdminGuard><AdminAlerts /></AdminGuard>} />
        <Route path="playbooks" element={<Playbooks />} />
        <Route path="reports" element={<Placeholder title="Weekly and monthly reports" intro="A summary of what was detected, what was handled and what needs attention."
          status="Your first report is created after a week of monitoring." points={['Alerts by severity and by system', 'How fast your team responded', 'Trends compared with the previous period']} />} />
        <Route path="risk" element={<Placeholder title="AI risk score engine" intro="A live score for each system, user and department, based on how far behaviour drifts from normal."
          status="Calibrating: the engine needs connected systems to learn from." points={['Learns a baseline for every user and system', 'Scores unusual behaviour as it happens', 'Explains which factors raised the score']} />} />
        <Route path="departments" element={<Placeholder title="Department intelligence" intro="See which parts of your institution carry the most risk."
          status="Departments appear once your systems are connected." points={['Alerts and risk grouped by department', 'Which teams touch which systems', 'Where unusual access is concentrated']} />} />
        <Route path="community" element={<Placeholder title="Community reporting" intro="Share and receive fraud warnings with other institutions, so one victim becomes everyone’s early warning."
          status="Community reporting opens soon." points={['Report a new scam pattern, with your name kept private', 'Get alerts when peers in your sector see the same attack', 'Search patterns reported by other institutions']} />} />
      </Route>
    </Routes>
  )
}
