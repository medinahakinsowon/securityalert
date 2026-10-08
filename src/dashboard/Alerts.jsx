import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { PageTitle, Card, Chip, Empty, SEV, STATUS } from './ui.jsx'
import History from './History.jsx'
import { api } from '../lib/api.js'
import { usePoll } from '../lib/usePoll.js'
import { timeAgo } from '../lib/time.js'

const pill = (on) => `rounded-full border px-3.5 py-1.5 text-sm ${on ? 'border-cyan bg-cyan text-bg' : 'border-line hover:border-cyan'}`
const PROMPT = { resolved: 'What did you do to deal with this?', false_alarm: 'Why is this a false alarm?' }

export default function Alerts() {
  const { organisation: org } = useOutletContext()
  const [status, setStatus] = useState('open')
  const [severity, setSeverity] = useState('all')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [asking, setAsking] = useState(null) // { id, status } while a note is being written
  const [note, setNote] = useState('')
  const p = org?.profile || {}
  const canHandle = org?.permissions?.includes('alerts:handle')

  const load = () => api(`/alerts?status=${status}&severity=${severity}`).then((d) => { setData(d); setError('') }).catch((e) => setError(e.message))
  usePoll(load, 5000, [status, severity])
  const act = (id, s, text) => api(`/alerts/${id}`, { method: 'PATCH', body: { status: s, note: text } })
    .then(() => { setAsking(null); setNote(''); load() }).catch((e) => setError(e.message))

  return (
    <>
      <PageTitle title="Real-time fraud alerts" intro="Every suspicious event across your connected systems, newest first. When you close an alert, note what was done: it is kept as your record." />
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <Card>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="flex gap-2" role="group" aria-label="Status">
              {[['open', 'Open'], ['resolved', 'Resolved'], ['false_alarm', 'False alarms'], ['all', 'All']].map(([v, l]) => <button key={v} className={pill(status === v)} aria-pressed={status === v} onClick={() => setStatus(v)}>{l}</button>)}
            </div>
            <div className="flex gap-2 sm:ml-auto" role="group" aria-label="Severity">
              {[['all', 'Any severity'], ['critical', 'Critical'], ['warning', 'Warning']].map(([v, l]) => <button key={v} className={pill(severity === v)} aria-pressed={severity === v} onClick={() => setSeverity(v)}>{l}</button>)}
            </div>
          </div>
          {error && <p role="alert" className="mb-3 text-sm text-signal">{error}</p>}
          {!data ? <p className="text-fg/60">Loading…</p> : !data.alerts.length ? (
            <Empty>{status === 'open' ? 'No open alerts. When something looks wrong it will appear here.' : 'Nothing to show for this filter.'}</Empty>
          ) : (
            <ul>
              {data.alerts.map((a) => {
                const closing = ['resolved', 'false_alarm'].includes(a.status)
                const last = [...a.history].reverse().find((h) => h.note)
                return (
                  <li key={a.id} className="border-t border-line py-4 first:border-t-0">
                    <div className="flex gap-3">
                      <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${SEV[a.severity]}`} />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{a.message}</p>
                        <p className="mt-0.5 text-xs text-fg/55">{a.system} · {timeAgo(a.createdAt)} · <span className="text-fg/80">{STATUS[a.status]}</span></p>
                        {closing && last && <p className="mt-2 text-sm text-fg/70">What was done: “{last.note}”</p>}
                        <details className="mt-2 text-sm text-fg/70">
                          <summary className="cursor-pointer text-cyan">Details and history</summary>
                          <dl className="mt-2 grid grid-cols-[8rem_1fr] gap-x-3 gap-y-1">
                            {Object.entries(a.details).filter(([, v]) => v != null).map(([k, v]) => <div key={k} className="contents"><dt className="text-fg/50">{k}</dt><dd className="break-words">{String(v)}</dd></div>)}
                          </dl>
                          <div className="mt-4"><History history={a.history} /></div>
                        </details>

                        {canHandle && asking?.id === a.id ? (
                          <div className="mt-3">
                            <label htmlFor={`n${a.id}`} className="block text-sm font-semibold">{PROMPT[asking.status]}</label>
                            <textarea id={`n${a.id}`} rows={2} maxLength={500} autoFocus className="field mt-1.5" value={note} onChange={(e) => setNote(e.target.value)} />
                            <div className="mt-2 flex gap-2">
                              <button className="btn-primary !px-3 !py-1.5" disabled={note.trim().length < 3} onClick={() => act(a.id, asking.status, note)}>Save and close</button>
                              <button className="btn-ghost !px-3 !py-1.5" onClick={() => { setAsking(null); setNote('') }}>Cancel</button>
                            </div>
                          </div>
                        ) : canHandle && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {a.status === 'new' && <button className="btn-ghost !px-3 !py-1.5" onClick={() => act(a.id, 'investigating')}>Investigate</button>}
                            {!closing && <>
                              <button className="btn-ghost !px-3 !py-1.5" onClick={() => { setAsking({ id: a.id, status: 'resolved' }); setNote('') }}>Resolve</button>
                              <button className="btn-ghost !px-3 !py-1.5" onClick={() => { setAsking({ id: a.id, status: 'false_alarm' }); setNote('') }}>False alarm</button>
                            </>}
                            {closing && <button className="btn-ghost !px-3 !py-1.5" onClick={() => act(a.id, 'new')}>Reopen</button>}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
        <Card className="self-start">
          <h2 className="font-display text-lg font-bold">Your alert settings</h2>
          <p className="mt-3 text-sm text-fg/60">Threats you asked us to watch</p>
          <ul className="mt-2 flex flex-wrap gap-2">{(p.threats || []).map((t) => <Chip key={t}>{t}</Chip>)}</ul>
          <p className="mt-5 text-sm text-fg/60">Delivered by</p>
          <ul className="mt-2 flex flex-wrap gap-2">{(p.channels || []).map((c) => <Chip key={c}>{c}</Chip>)}</ul>
          <p className="mt-4 text-sm text-fg/60">Email alerts are live. SMS, WhatsApp and chat are coming.</p>
        </Card>
      </div>
    </>
  )
}
