import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import { api } from '../lib/api.js'
import { ROLES } from '../data/roles.js'

export default function AcceptInvite() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const navigate = useNavigate()
  const [info, setInfo] = useState(null)
  const [error, setError] = useState('')
  const [f, setF] = useState({ fullName: '', password: '', confirm: '' })
  const [busy, setBusy] = useState(false)
  const ran = useRef(false)
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setError('') }

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    if (!token) return setError('This invitation link is incomplete. Open it from the email again.')
    api('/auth/invite-info', { method: 'POST', body: { token } }).then(setInfo).catch((e) => setError(e.message))
  }, [token])

  const submit = async (e) => {
    e.preventDefault()
    if (!f.fullName.trim()) return setError('Enter your full name.')
    if (f.password.length < 8) return setError('Use at least 8 characters for your password.')
    if (f.password !== f.confirm) return setError('The two passwords do not match.')
    setBusy(true)
    try { await api('/auth/accept-invite', { method: 'POST', body: { token, fullName: f.fullName, password: f.password } }); navigate('/dashboard') }
    catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }

  if (!info) return (
    <AuthShell title={error ? 'We could not open this invitation' : 'Opening your invitation…'}>
      {error && <><p role="alert" className="text-signal">{error}</p><Link to="/login" className="btn-ghost mt-6">Log in</Link></>}
    </AuthShell>
  )

  return (
    <AuthShell title={`Join ${info.orgName}`}>
      <p className="text-fg/75">{info.inviter ? <b>{info.inviter}</b> : 'An administrator'} invited <b>{info.email}</b> to join as <b>{ROLES[info.role]?.label}</b>. {ROLES[info.role]?.desc}</p>
      <form onSubmit={submit} noValidate className="mt-6 space-y-5">
        <div><label htmlFor="n" className="mb-1.5 block text-sm font-semibold">Your full name</label>
          <input id="n" className="field" autoComplete="name" value={f.fullName} onChange={set('fullName')} /></div>
        <div><label htmlFor="p" className="mb-1.5 block text-sm font-semibold">Choose a password</label>
          <input id="p" type="password" className="field" autoComplete="new-password" value={f.password} onChange={set('password')} />
          <p className="mt-1.5 text-xs text-fg/60">At least 8 characters.</p></div>
        <div><label htmlFor="c" className="mb-1.5 block text-sm font-semibold">Confirm password</label>
          <input id="c" type="password" className="field" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} /></div>
        {error && <p role="alert" className="text-sm text-signal">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? 'Joining…' : 'Join the team'}</button>
      </form>
    </AuthShell>
  )
}
