import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import { api } from '../lib/api.js'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.')
    setBusy(true)
    try { await api('/auth/forgot-password', { method: 'POST', body: { email } }); setSent(true) }
    catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }

  return (
    <AuthShell title="Reset your password">
      {sent ? (
        <p className="text-fg/75">If an account exists for <b>{email}</b>, a reset link is on its way. It is valid for one hour.</p>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-5">
          <p className="text-fg/70">Enter your work email and we will send you a link to choose a new password.</p>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">Work email</label>
            <input id="email" type="email" autoComplete="email" className="field" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} />
          </div>
          {error && <p role="alert" className="text-sm text-signal">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</button>
        </form>
      )}
      <Link to="/login" className="mt-6 inline-block text-sm font-semibold text-cyan hover:underline">Back to log in</Link>
    </AuthShell>
  )
}
