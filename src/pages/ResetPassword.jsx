import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import { api } from '../lib/api.js'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [pw, setPw] = useState({ password: '', confirm: '' })
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => { setPw({ ...pw, [k]: e.target.value }); setError('') }

  const submit = async (e) => {
    e.preventDefault()
    if (pw.password.length < 8) return setError('Use at least 8 characters.')
    if (pw.password !== pw.confirm) return setError('The two passwords do not match.')
    setBusy(true)
    try { await api('/auth/reset-password', { method: 'POST', body: { token, password: pw.password } }); setDone(true) }
    catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }

  if (!token) return <AuthShell title="Reset link incomplete"><p className="text-fg/75">Open the link from your email again, or <Link to="/forgot-password" className="text-cyan hover:underline">request a new one</Link>.</p></AuthShell>

  return (
    <AuthShell title={done ? 'Password changed' : 'Choose a new password'}>
      {done ? (
        <>
          <p className="text-fg/75">You have been signed out everywhere. Log in with your new password.</p>
          <Link to="/login" className="btn-primary mt-6">Log in</Link>
        </>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-5">
          <div>
            <label htmlFor="pw" className="mb-1.5 block text-sm font-semibold">New password</label>
            <input id="pw" type="password" autoComplete="new-password" className="field" value={pw.password} onChange={set('password')} />
            <p className="mt-1.5 text-xs text-fg/60">At least 8 characters.</p>
          </div>
          <div>
            <label htmlFor="pw2" className="mb-1.5 block text-sm font-semibold">Confirm new password</label>
            <input id="pw2" type="password" autoComplete="new-password" className="field" value={pw.confirm} onChange={set('confirm')} />
          </div>
          {error && <p role="alert" className="text-sm text-signal">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? 'Saving…' : 'Change password'}</button>
        </form>
      )}
    </AuthShell>
  )
}
