import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { PageTitle, Card, AlertRow, Empty } from './ui.jsx'
import { api } from '../lib/api.js'
import { usePoll } from '../lib/usePoll.js'

export default function Overview() {
  const { user, organisation: org } = useOutletContext()
  const [d, setD] = useState(null)
  usePoll(() => api('/overview').then(setD).catch(() => {}), 10000)
  const p = org?.profile || {}

  const stats = d ? [
    ['Open alerts', d.openAlerts ?? '–', d.openAlerts ? 'text-amber' : ''],
    ['Critical', d.criticalOpen ?? '–', d.criticalOpen ? 'text-signal' : ''],
    ['Events, last 24 hours', d.events24h, ''],
    ['Risk score', 'Calibrating', ''],
  ] : []

  return (
    <>
      <PageTitle title={`Welcome, ${user.fullName.split(' ')[0]}`} intro="What is happening across your systems right now." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([k, v, c]) => <Card key={k}><p className="text-sm text-fg/60">{k}</p><p className={`mt-1 font-display text-3xl font-bold ${c}`}>{v}</p></Card>)}
      </div>

      {d && (
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <Card>
            <h2 className="font-display text-xl font-bold">Latest alerts</h2>
            <div className="mt-3">
              {d.recent.length ? <ul>{d.recent.map((a) => <AlertRow key={a.id} a={a} />)}</ul>
                : <Empty>{org?.permissions?.includes('alerts:view') ? 'No alerts yet. Connect a system, or send a test scenario from Connect systems.' : 'Alerts are not part of your role.'}</Empty>}
            </div>
            {d.recent.length > 0 && <Link to="alerts" className="mt-3 inline-block text-sm font-semibold text-cyan hover:underline">See all alerts</Link>}
          </Card>
          <Card>
            <h2 className="font-display text-xl font-bold">Your connection</h2>
            {d.systems.length ? (
              <>
                <p className="mt-2 text-sm text-fg/70">Receiving events from:</p>
                <ul className="mt-3 flex flex-wrap gap-2">{d.systems.map((s) => <li key={s} className="rounded-full bg-mint/15 px-3 py-1 text-sm text-mint">{s}</li>)}</ul>
              </>
            ) : (
              <p className="mt-2 text-fg/70">{d.hasKey ? 'Your key is ready but no events have arrived yet.' : 'No system is connected yet.'} <Link to="connect" className="font-semibold text-cyan hover:underline">Connect a system</Link></p>
            )}
            <p className="mt-5 text-sm font-semibold">You asked us to protect</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-fg/70">{(p.systems || []).map((s) => <li key={s}>{s}</li>)}</ul>
          </Card>
        </div>
      )}
    </>
  )
}
