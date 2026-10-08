import { useState } from 'react'
import AuthShell from '../components/AuthShell.jsx'
import { api } from '../lib/api.js'

// Shown instead of the dashboard until the email address is confirmed.
export default function VerifyPending({ email, onRefresh, onLogout }) {
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  const resend = async () => {
    setBusy(true)
    try { await api('/auth/resend-verification', { method: 'POST' }); setNote('A new link is on its way. Check your inbox and spam folder.') }
    catch (e) { setNote(e.message) }
    finally { setBusy(false) }
  }
  const check = async () => { await onRefresh(); setNote('Still waiting. Open the link in the email first.') }

  return (
    <AuthShell title="Verify your email to continue">
      <p className="text-fg/75">We sent a verification link to <b>{email}</b>. Open it to activate your account and unlock your dashboard.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="btn-primary" onClick={check}>I have verified</button>
        <button className="btn-ghost" onClick={resend} disabled={busy}>Resend email</button>
        <button className="btn-ghost" onClick={onLogout}>Log out</button>
      </div>
      {note && <p role="status" className="mt-4 text-sm text-fg/70">{note}</p>}
    </AuthShell>
  )
}
