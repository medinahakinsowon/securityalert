import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageTitle, Card, Empty, OrgBadge } from './ui.jsx'
import { api } from '../lib/api.js'
import { usePoll } from '../lib/usePoll.js'
import { timeAgo } from '../lib/time.js'

const TABS = [['all', 'All'], ['pending', 'Pending approval'], ['approved', 'Approved'], ['rejected', 'Rejected']]

export default function AdminInstitutions() {
  const [tab, setTab] = useState('all')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  usePoll(() => api(`/admin/organisations?status=${tab}`).then((d) => { setData(d); setError('') }).catch((e) => setError(e.message)), 15000, [tab])

  return (
    <>
      <PageTitle title="Institutions" intro="Every institution that signed up, with its team and how many alerts it has handled. Open one to see its people, alerts and the actions taken." />
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Status">
        {TABS.map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)} aria-pressed={tab === v}
            className={`rounded-full border px-3.5 py-1.5 text-sm ${tab === v ? 'border-cyan bg-cyan text-bg' : 'border-line hover:border-cyan'}`}>
            {l}{data ? ` (${data.counts[v]})` : ''}
          </button>
        ))}
      </div>
      {error && <p role="alert" className="mb-3 text-sm text-signal">{error}</p>}
      <div className="grid gap-4 xl:grid-cols-2">
        {data && !data.organisations.length && <Empty>Nothing here.</Empty>}
        {data?.organisations.map((o) => (
          <Card key={o.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate font-display text-xl font-bold">{o.name}</h2>
                <p className="text-sm text-fg/60">{o.type} · {o.size} staff · {o.country} · joined {timeAgo(o.createdAt)}</p>
              </div>
              <OrgBadge status={o.status} />
            </div>
            <p className="mt-3 text-sm">{o.owner.fullName} · <span className="text-fg/70">{o.owner.email}</span></p>
            <dl className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
              {[['Team', o.teamSize], ['Open alerts', o.alerts.open], ['Resolved', o.alerts.resolved], ['False alarms', o.alerts.falseAlarm]].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-bg px-2 py-2"><dd className="font-display text-xl font-bold">{v}</dd><dt className="text-xs text-fg/55">{k}</dt></div>
              ))}
            </dl>
            <Link to={`/dashboard/admin/institutions/${o.id}`} className={`mt-4 ${o.status === 'pending' ? 'btn-primary' : 'btn-ghost'} !px-4 !py-2`}>{o.status === 'pending' ? 'Review and decide' : 'Open'}</Link>
          </Card>
        ))}
      </div>
    </>
  )
}
