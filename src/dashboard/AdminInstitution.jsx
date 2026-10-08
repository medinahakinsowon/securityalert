import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageTitle, Card, Empty, OrgBadge, SEV, STATUS } from './ui.jsx'
import History from './History.jsx'
import { api } from '../lib/api.js'
import { usePoll } from '../lib/usePoll.js'
import { timeAgo } from '../lib/time.js'
import { ROLES } from '../data/roles.js'

function Decision({ org, onDone }) {
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const decide = async (decision) => {
    setError('')
    try { await api(`/admin/organisations/${org.id}/decision`, { method: 'POST', body: { decision, note } }); setNote(''); onDone() }
    catch (e) { setError(e.message) }
  }
  return (
    <Card>
      <h2 className="font-display text-xl font-bold">Approval</h2>
      {org.reviewNote && <p className="mt-2 text-sm text-fg/70">Last note: “{org.reviewNote}”</p>}
      <label htmlFor="note" className="mt-4 block text-sm font-semibold">Note to the applicant <span className="font-normal text-fg/50">(required to reject)</span></label>
      <textarea id="note" rows={2} maxLength={500} className="field mt-1.5" value={note} onChange={(e) => setNote(e.target.value)} />
      {error && <p role="alert" className="mt-2 text-sm text-signal">{error}</p>}
      <div className="mt-3 flex gap-3">
        {org.status !== 'approved' && <button className="btn-primary" onClick={() => decide('approved')}>Approve</button>}
        {org.status !== 'rejected' && <button className="btn-ghost" onClick={() => decide('rejected')}>Reject</button>}
      </div>
    </Card>
  )
}

export default function AdminInstitution() {
  const { id } = useParams()
  const [o, setO] = useState(null)
  const [error, setError] = useState('')
  const load = () => api(`/admin/organisations/${id}`).then((d) => { setO(d); setError('') }).catch((e) => setError(e.message))
  usePoll(load, 15000, [id])

  if (error) return <p role="alert" className="text-signal">{error}</p>
  if (!o) return <p className="text-fg/60">Loading…</p>
  const p = o.profile, s = o.alertStats
  const answers = [['Systems to protect', p.systems], ['Top threats', p.threats], ['Recent incident', p.pastIncident], ['Alert channels', p.channels], ['Responders', p.responders]]

  return (
    <>
      <Link to="/dashboard/admin/institutions" className="mb-4 inline-block text-sm text-cyan hover:underline">All institutions</Link>
      <div className="flex flex-wrap items-center gap-3"><h1 className="text-3xl font-bold">{o.name}</h1><OrgBadge status={o.status} /></div>
      <p className="mt-2 text-fg/70">{o.type} · {o.size} staff · {o.country} · joined {timeAgo(o.createdAt)}</p>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Decision org={o} onDone={load} />
        <Card>
          <h2 className="font-display text-xl font-bold">What they told us</h2>
          <dl className="mt-3 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[10rem_1fr]">
            {answers.map(([k, v]) => <div key={k} className="contents"><dt className="text-fg/50">{k}</dt><dd>{Array.isArray(v) ? v.join(', ') : v}</dd></div>)}
          </dl>
        </Card>

        <Card>
          <h2 className="font-display text-xl font-bold">Team and roles</h2>
          <ul className="mt-3">
            {o.team.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 border-t border-line py-3 first:border-t-0">
                <div className="min-w-0"><p className="font-medium">{m.fullName}</p><p className="truncate text-sm text-fg/60">{m.email}</p></div>
                <span className="shrink-0 rounded-full border border-line px-3 py-1 text-sm">{ROLES[m.role]?.label || m.role}</span>
              </li>
            ))}
          </ul>
          {o.invitations.length > 0 && <>
            <p className="mt-4 text-sm font-semibold">Invited, not yet joined</p>
            <ul className="mt-1 text-sm text-fg/70">{o.invitations.map((i) => <li key={i.email}>{i.email} · {ROLES[i.role]?.label}</li>)}</ul>
          </>}
        </Card>
        <Card>
          <h2 className="font-display text-xl font-bold">Connection and alerts</h2>
          <p className="mt-3 text-sm text-fg/70">{o.connection.systems.length ? `Receiving events from ${o.connection.systems.join(', ')}.` : 'No real system connected yet.'} {o.connection.activeKeys} active API key{o.connection.activeKeys === 1 ? '' : 's'}.</p>
          <dl className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
            {[['Total', s.total], ['Open', s.open], ['Resolved', s.resolved], ['False alarms', s.falseAlarm]].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-bg px-2 py-2"><dd className="font-display text-xl font-bold">{v}</dd><dt className="text-xs text-fg/55">{k}</dt></div>
            ))}
          </dl>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="font-display text-xl font-bold">Alerts and the action taken</h2>
        {!o.alerts.length ? <div className="mt-3"><Empty>No alerts for this institution yet.</Empty></div> : (
          <ul className="mt-3">
            {o.alerts.map((a) => (
              <li key={a.id} className="border-t border-line py-4 first:border-t-0">
                <div className="flex gap-3">
                  <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${SEV[a.severity]}`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{a.message}</p>
                    <p className="mt-0.5 text-xs text-fg/55">{a.system} · {timeAgo(a.createdAt)} · <span className="text-fg/80">{STATUS[a.status]}</span></p>
                    <div className="mt-3"><History history={a.history} /></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
