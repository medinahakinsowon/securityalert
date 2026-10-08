import { useState } from 'react'
import { PageTitle, Card, Empty } from './ui.jsx'
import { api } from '../lib/api.js'
import { usePoll } from '../lib/usePoll.js'
import { ROLES, assignable } from '../data/roles.js'

export default function Team() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('analyst')
  const [note, setNote] = useState('')
  const [link, setLink] = useState('')
  const load = () => api('/team').then((d) => { setData(d); setError('') }).catch((e) => setError(e.message))
  usePoll(load, 15000)

  const options = assignable(data?.myRole)
  const run = (p) => p.then(load).catch((e) => setError(e.message))

  const invite = async (e) => {
    e.preventDefault(); setError(''); setNote(''); setLink('')
    try {
      const d = await api('/team/invitations', { method: 'POST', body: { email, role } })
      setNote(`Invitation sent to ${email}.`); setLink(d.devLink || ''); setEmail(''); load()
    } catch (err) { setError(err.message) }
  }
  const remove = (m) => window.confirm(`Remove ${m.fullName}? They will be signed out and lose access immediately.`) && run(api(`/team/members/${m.id}`, { method: 'DELETE' }))

  return (
    <>
      <PageTitle title="Team" intro="Invite colleagues and choose what each person can do. Alert emails go to owners, admins and analysts." />
      {error && <p role="alert" className="mb-4 text-sm text-signal">{error}</p>}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="font-display text-xl font-bold">Invite a colleague</h2>
            <form onSubmit={invite} className="mt-4 grid gap-3 sm:grid-cols-[1fr_11rem_auto]">
              <label className="sr-only" htmlFor="inv-email">Email</label>
              <input id="inv-email" type="email" required className="field" placeholder="colleague@institution.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <label className="sr-only" htmlFor="inv-role">Role</label>
              <select id="inv-role" className="field" value={role} onChange={(e) => setRole(e.target.value)}>
                {options.map((r) => <option key={r} value={r}>{ROLES[r].label}</option>)}
              </select>
              <button className="btn-primary" disabled={!email}>Send invite</button>
            </form>
            <p className="mt-2 text-sm text-fg/60">{ROLES[role]?.desc}</p>
            {note && <p role="status" className="mt-3 text-sm text-mint">{note}</p>}
            {link && (
              <div className="mt-3 rounded-lg border border-amber/40 bg-amber/10 p-3 text-sm">
                <p className="text-amber">Email sending is not set up on this server, so share this link yourself. It works once and expires in 7 days.</p>
                <code className="mt-2 block break-all rounded bg-bg px-3 py-2">{link}</code>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="font-display text-xl font-bold">People</h2>
            <ul className="mt-3">
              {(data?.members || []).map((m) => {
                const editable = !m.isYou && options.includes(m.role)
                return (
                  <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-3 first:border-t-0">
                    <div className="min-w-0"><p className="font-medium">{m.fullName}{m.isYou && <span className="text-fg/50"> (you)</span>}</p><p className="truncate text-sm text-fg/60">{m.email}</p></div>
                    <div className="flex items-center gap-3">
                      {editable ? (
                        <>
                          <select aria-label={`Role for ${m.fullName}`} className="field !w-auto !py-1.5" value={m.role}
                            onChange={(e) => run(api(`/team/members/${m.id}`, { method: 'PATCH', body: { role: e.target.value } }))}>
                            {options.map((r) => <option key={r} value={r}>{ROLES[r].label}</option>)}
                          </select>
                          <button className="text-sm text-signal hover:underline" onClick={() => remove(m)}>Remove</button>
                        </>
                      ) : <span className="rounded-full border border-line px-3 py-1 text-sm">{ROLES[m.role].label}</span>}
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>

          <Card>
            <h2 className="font-display text-xl font-bold">Waiting to join</h2>
            {data && !data.invitations.length ? <div className="mt-3"><Empty>No pending invitations.</Empty></div> : (
              <ul className="mt-3">
                {(data?.invitations || []).map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-3 border-t border-line py-3 first:border-t-0">
                    <div className="min-w-0"><p className="truncate font-medium">{i.email}</p><p className="text-sm text-fg/60">{ROLES[i.role].label}</p></div>
                    <button className="text-sm text-signal hover:underline" onClick={() => run(api(`/team/invitations/${i.id}`, { method: 'DELETE' }))}>Cancel</button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card className="self-start">
          <h2 className="font-display text-lg font-bold">What each role can do</h2>
          <dl className="mt-3 space-y-4 text-sm">
            {Object.entries(ROLES).map(([k, r]) => <div key={k}><dt className="font-semibold">{r.label}</dt><dd className="text-fg/70">{r.desc}</dd></div>)}
          </dl>
        </Card>
      </div>
    </>
  )
}
