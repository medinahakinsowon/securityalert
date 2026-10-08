import { useState } from 'react'
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bell, Search, FileText, Gauge, BookOpen, Building2, Users, LayoutDashboard, Plug, ShieldCheck, UserPlus } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import { api } from '../lib/api.js'
import { usePoll } from '../lib/usePoll.js'
import VerifyPending from './VerifyPending.jsx'
import { ROLES } from '../data/roles.js'

// The eight dashboard functions, plus Connect systems (and Admin for platform admins).
export const modules = [
  { to: '/dashboard', end: true, label: 'Dashboard & Analytics', Icon: LayoutDashboard },
  { to: 'alerts', label: 'Real-time Fraud Alerts', Icon: Bell, perm: 'alerts:view' },
  { to: 'library', label: 'Fraud Library & Search', Icon: Search },
  { to: 'reports', label: 'Weekly / Monthly Reports', Icon: FileText },
  { to: 'risk', label: 'AI Risk Score Engine', Icon: Gauge },
  { to: 'playbooks', label: 'Playbooks & Response Guides', Icon: BookOpen },
  { to: 'departments', label: 'Department Intelligence', Icon: Building2 },
  { to: 'community', label: 'Community Reporting', Icon: Users },
  { to: 'connect', label: 'Connect systems', Icon: Plug, perm: 'keys:manage' },
  { to: 'team', label: 'Team', Icon: UserPlus, perm: 'team:manage' },
]
const adminModules = [
  { to: '/dashboard/admin', end: true, label: 'Platform overview', Icon: ShieldCheck },
  { to: '/dashboard/admin/institutions', label: 'Institutions', Icon: Building2 },
  { to: '/dashboard/admin/alerts', label: 'All alerts', Icon: Bell },
]

export default function DashboardLayout() {
  const [me, setMe] = useState(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Re-checks every 30s, so approval and email verification show up without a manual refresh.
  const refresh = () => api('/auth/me').then(setMe).catch(() => navigate('/login', { replace: true }))
  usePoll(refresh, 30000)
  const logout = async () => { await api('/auth/logout', { method: 'POST' }); navigate('/') }

  if (!me) return <p className="p-10 text-fg/70">Loading your dashboard…</p>
  if (!me.user.emailVerified) return <VerifyPending email={me.user.email} onRefresh={refresh} onLogout={logout} />

  const org = me.organisation
  // The platform owner has no institution of their own: they go straight to the review page.
  const adminOnly = !org && me.user.isAdmin
  if (adminOnly && pathname === '/dashboard') return <Navigate to="/dashboard/admin" replace />
  if (!org && !me.user.isAdmin) return <p className="p-10 text-fg/70">No institution is linked to this account. <button className="underline" onClick={logout}>Log out</button></p>
  const allowed = modules.filter((m) => !m.perm || org?.permissions?.includes(m.perm))
  const nav = adminOnly ? adminModules : me.user.isAdmin ? [...allowed, ...adminModules] : allowed

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[18rem_1fr]">
      <aside className="border-b border-line bg-surface lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="px-4 py-3 lg:px-5 lg:py-6"><Logo size="h-9" /></div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0" aria-label="Dashboard">
          {nav.map(({ to, end, label, Icon }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-cyan/15 text-cyan' : 'text-fg/75 hover:bg-fg/5'}`}>
              <Icon size={18} aria-hidden /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <p className="truncate font-display font-bold">{org?.name || 'AbiSentry administration'}</p>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-fg/70 sm:block">{me.user.fullName} · {org ? ROLES[org.role]?.label : 'Platform admin'}</span>
            <button className="btn-ghost !px-3 !py-1.5" onClick={logout}>Log out</button>
          </div>
        </header>
        {org?.status === 'pending' && (
          <p role="status" className="border-b border-amber/40 bg-amber/10 px-5 py-3 text-sm text-amber">
            Your institution is under review. We will email you when it is approved, and then you can connect your systems. Until then you can explore with test data.{' '}
            <button className="underline" onClick={refresh}>Check status</button>
          </p>
        )}
        {org?.status === 'rejected' && (
          <p role="alert" className="border-b border-signal/40 bg-signal/10 px-5 py-3 text-sm text-signal">
            We could not approve this institution.{org.reviewNote ? ` Reason: ${org.reviewNote}` : ''} Reply to our email if you think this is a mistake.
          </p>
        )}
        <main className="px-5 py-8 lg:px-10"><Outlet context={{ ...me, refresh }} /></main>
      </div>
    </div>
  )
}
