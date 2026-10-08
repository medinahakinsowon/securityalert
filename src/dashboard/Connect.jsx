import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { PageTitle, Card, Empty } from './ui.jsx'
import { api } from '../lib/api.js'
import { usePoll } from '../lib/usePoll.js'
import { timeAgo } from '../lib/time.js'

const SCENARIOS = [
  ['takeover', 'Account takeover', 'Six failed logins, then a successful one'],
  ['transfer', 'Unusual transfer', 'Normal transfers, then one about 20x larger'],
  ['export', 'Bulk data export', '22,000 records downloaded at once'],
]

const example = (key) => `Invoke-RestMethod -Uri http://localhost:4000/api/ingest/events -Method Post \`
  -Headers @{ Authorization = "Bearer ${key}" } -ContentType "application/json" \`
  -Body '{"type":"login_failed","system":"Core banking","actor":"teller12","ip":"41.58.1.9"}'`

export default function Connect() {
  const { organisation: org } = useOutletContext()
  const approved = org?.status === 'approved'
  const [keys, setKeys] = useState(null)
  const [label, setLabel] = useState('')
  const [fresh, setFresh] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const load = () => api('/keys').then((d) => setKeys(d.keys)).catch((e) => setError(e.message))
  usePoll(load, 15000)

  const create = async (e) => {
    e.preventDefault(); setError('')
    try { const d = await api('/keys', { method: 'POST', body: { label } }); setFresh(d.key); setLabel(''); setCopied(false); load() }
    catch (err) { setError(err.message) }
  }
  const revoke = (id) => window.confirm('Revoke this key? Systems using it will stop sending events.') && api(`/keys/${id}`, { method: 'DELETE' }).then(load)
  const copy = () => navigator.clipboard.writeText(fresh).then(() => setCopied(true))
  const run = async (s) => {
    setMsg('')
    try { const d = await api(`/demo/${s}`, { method: 'POST' }); setMsg(`Sent ${d.accepted} test events and raised ${d.alertsCreated} alert${d.alertsCreated === 1 ? '' : 's'}. Open Real-time Fraud Alerts to see them.`) }
    catch (err) { setMsg(err.message) }
  }

  return (
    <>
      <PageTitle title="Connect your systems" intro="Your systems send us events with an API key. We check each one against the detection rules and raise an alert when something looks wrong." />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl font-bold">Try it with test data</h2>
          <p className="mt-1 text-sm text-fg/70">No system needed. These send realistic events through the same path as a real connection.</p>
          <ul className="mt-4 space-y-3">
            {SCENARIOS.map(([id, name, desc]) => (
              <li key={id} className="flex items-center justify-between gap-3">
                <div><p className="font-semibold">{name}</p><p className="text-sm text-fg/60">{desc}</p></div>
                <button className="btn-ghost shrink-0 !px-3 !py-1.5" onClick={() => run(id)}>Send</button>
              </li>
            ))}
          </ul>
          {msg && <p role="status" className="mt-4 text-sm text-mint">{msg}</p>}
        </Card>

        {!approved ? (
          <Card>
            <h2 className="font-display text-xl font-bold">API keys</h2>
            <p className="mt-3 text-fg/75">{org?.status === 'rejected' ? 'This institution was not approved, so API keys are not available.' : 'API keys unlock once our team has approved your institution. We review each one to keep the platform safe, and we will email you as soon as it is done.'}</p>
          </Card>
        ) : (
        <Card>
          <h2 className="font-display text-xl font-bold">API keys</h2>
          <form onSubmit={create} className="mt-3 flex gap-2">
            <label htmlFor="keylabel" className="sr-only">Key name</label>
            <input id="keylabel" className="field" placeholder="Name, for example Core banking" value={label} onChange={(e) => setLabel(e.target.value)} />
            <button className="btn-primary shrink-0" disabled={!label.trim()}>Create key</button>
          </form>
          {error && <p role="alert" className="mt-2 text-sm text-signal">{error}</p>}
          {fresh && (
            <div className="mt-4 rounded-lg border border-amber/40 bg-amber/10 p-3">
              <p className="text-sm text-amber">Copy this key now. For your safety it will not be shown again.</p>
              <code className="mt-2 block break-all rounded bg-bg px-3 py-2 text-sm">{fresh}</code>
              <button className="btn-ghost mt-2 !px-3 !py-1.5" onClick={copy}>{copied ? 'Copied' : 'Copy key'}</button>
            </div>
          )}
          <div className="mt-4">
            {keys && !keys.length ? <Empty>No keys yet.</Empty> : (
              <ul>{(keys || []).map((k) => (
                <li key={k.id} className="flex items-center justify-between gap-3 border-t border-line py-3 first:border-t-0">
                  <div className="min-w-0"><p className="font-medium">{k.label}</p>
                    <p className="text-xs text-fg/55">{k.prefix}… · {k.lastUsedAt ? `used ${timeAgo(k.lastUsedAt)}` : 'never used'}</p></div>
                  <button className="text-sm text-signal hover:underline" onClick={() => revoke(k.id)}>Revoke</button>
                </li>))}</ul>
            )}
          </div>
        </Card>
        )}
      </div>

      <Card className="mt-6">
        <h2 className="font-display text-xl font-bold">Send an event from your own system</h2>
        <p className="mt-1 text-sm text-fg/70">Any system that can make a web request can do this. Send one event, or up to 50 at a time as <code>{'{"events":[…]}'}</code>.</p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-bg p-4 text-sm"><code>{example(fresh || 'YOUR_API_KEY')}</code></pre>
        <p className="mt-5 text-sm font-semibold">Event types and the fields we use</p>
        <dl className="mt-2 divide-y divide-line text-sm">
          {[['login_failed, login_success', 'actor (user or account), ip, system'], ['transfer', 'actor, amount, system'], ['data_export', 'actor, records (how many), system'], ['record_edit, vendor_created', 'accepted and stored. Detection rules for these are coming.']].map(([t, f]) => (
            <div key={t} className="grid gap-1 py-2 sm:grid-cols-[14rem_1fr]"><dt className="font-mono text-cyan">{t}</dt><dd className="text-fg/70">{f}</dd></div>
          ))}
        </dl>
      </Card>
    </>
  )
}
