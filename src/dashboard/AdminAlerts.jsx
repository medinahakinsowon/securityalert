import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageTitle, Card, Empty, SEV, STATUS } from './ui.jsx'
import History from './History.jsx'
import { api } from '../lib/api.js'
import { usePoll } from '../lib/usePoll.js'
import { timeAgo } from '../lib/time.js'

const pill = (on) => `rounded-full border px-3.5 py-1.5 text-sm ${on ? 'border-cyan bg-cyan text-bg' : 'border-line hover:border-cyan'}`

export default function AdminAlerts() {
  const [status, setStatus] = useState('all')
  const [severity, setSeverity] = useState('all')
  const [org, setOrg] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  usePoll(() => api(`/admin/alerts?status=${status}&severity=${severity}&org=${org}`).then((d) => { setData(d); setError('') }).catch((e) => setError(e.message)), 10000, [status, severity, org])

  return (
    <>
      <PageTitle title="All alerts" intro="Alerts from every institution, with what each team did about them." />
      <Card>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {[['all', 'All'], ['open', 'Open'], ['resolved', 'Resolved'], ['false_alarm', 'False alarms']].map(([v, l]) => <button key={v} className={pill(status === v)} aria-pressed={status === v} onClick={() => setStatus(v)}>{l}</button>)}
          <span className="mx-1 hidden h-6 w-px bg-line sm:block" />
          {[['all', 'Any severity'], ['critical', 'Critical'], ['warning', 'Warning']].map(([v, l]) => <button key={v} className={pill(severity === v)} aria-pressed={severity === v} onClick={() => setSeverity(v)}>{l}</button>)}
          <label htmlFor="inst" className="sr-only">Institution</label>
          <select id="inst" className="field !w-auto sm:ml-auto" value={org} onChange={(e) => setOrg(e.target.value)}>
            <option value="">All institutions</option>
            {(data?.institutions || []).map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </div>
        {error && <p role="alert" className="mb-3 text-sm text-signal">{error}</p>}
        {!data ? <p className="text-fg/60">Loading…</p> : !data.alerts.length ? <Empty>Nothing matches these filters.</Empty> : (
          <ul>
            {data.alerts.map((a) => {
              const last = [...a.history].reverse().find((h) => h.note)
              return (
                <li key={a.id} className="border-t border-line py-4 first:border-t-0">
                  <div className="flex gap-3">
                    <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${SEV[a.severity]}`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{a.message}</p>
                      <p className="mt-0.5 text-xs text-fg/55"><Link to={`/dashboard/admin/institutions/${a.orgId}`} className="text-cyan hover:underline">{a.orgName}</Link> · {a.system} · {timeAgo(a.createdAt)} · <span className="text-fg/80">{STATUS[a.status]}</span></p>
                      {last && <p className="mt-2 text-sm text-fg/70">Action taken: “{last.note}” <span className="text-fg/50">by {last.by}</span></p>}
                      {a.history.length > 0 && <details className="mt-2 text-sm"><summary className="cursor-pointer text-cyan">Full history</summary><div className="mt-3"><History history={a.history} /></div></details>}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </>
  )
}
