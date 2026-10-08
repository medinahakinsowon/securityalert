import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageTitle, Card, Stat, Empty, SEV, STATUS } from './ui.jsx'
import { api } from '../lib/api.js'
import { usePoll } from '../lib/usePoll.js'
import { timeAgo } from '../lib/time.js'

export default function AdminOverview() {
  const [d, setD] = useState(null)
  const [error, setError] = useState('')
  usePoll(() => api('/admin/overview').then(setD).catch((e) => setError(e.message)), 15000)
  if (error) return <p role="alert" className="text-signal">{error}</p>
  if (!d) return <p className="text-fg/60">Loading…</p>
  const { institutions: i, alerts: a } = d

  return (
    <>
      <PageTitle title="Platform overview" intro="Every institution on AbiSentry Gossip, and what is happening across them." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Institutions" value={i.total} />
        <Stat label="Waiting for approval" value={i.pending} tone={i.pending ? 'text-amber' : ''} />
        <Stat label="Approved" value={i.approved} tone="text-mint" />
        <Stat label="Rejected" value={i.rejected} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="People on the platform" value={d.people} />
        <Stat label="Open alerts" value={a.open} tone={a.open ? 'text-amber' : ''} />
        <Stat label="Critical, open" value={a.critical} tone={a.critical ? 'text-signal' : ''} />
        <Stat label="Resolved" value={a.resolved} />
        <Stat label="False alarms" value={a.falseAlarm} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl font-bold">Waiting for approval</h2>
          {!d.pending.length ? <div className="mt-3"><Empty>Nobody is waiting.</Empty></div> : (
            <ul className="mt-3">
              {d.pending.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 border-t border-line py-3 first:border-t-0">
                  <div className="min-w-0"><p className="font-medium">{o.name}</p><p className="truncate text-sm text-fg/60">{o.type} · {o.country} · {o.owner.email} · {timeAgo(o.createdAt)}</p></div>
                  <Link to={`/dashboard/admin/institutions/${o.id}`} className="btn-ghost shrink-0 !px-3 !py-1.5">Review</Link>
                </li>
              ))}
            </ul>
          )}
          <Link to="/dashboard/admin/institutions" className="mt-3 inline-block text-sm font-semibold text-cyan hover:underline">See all institutions</Link>
        </Card>
        <Card>
          <h2 className="font-display text-xl font-bold">Latest alerts, all institutions</h2>
          {!d.recentAlerts.length ? <div className="mt-3"><Empty>No alerts yet.</Empty></div> : (
            <ul className="mt-3">
              {d.recentAlerts.map((x) => (
                <li key={x.id} className="flex gap-3 border-t border-line py-3 first:border-t-0">
                  <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${SEV[x.severity]}`} />
                  <div className="min-w-0"><p>{x.message}</p>
                    <p className="mt-0.5 text-xs text-fg/55"><Link to={`/dashboard/admin/institutions/${x.orgId}`} className="text-cyan hover:underline">{x.orgName}</Link> · {timeAgo(x.createdAt)} · {STATUS[x.status]}</p></div>
                </li>
              ))}
            </ul>
          )}
          <Link to="/dashboard/admin/alerts" className="mt-3 inline-block text-sm font-semibold text-cyan hover:underline">See all alerts</Link>
        </Card>
      </div>
    </>
  )
}
