import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import { api } from '../lib/api.js'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const [state, setState] = useState({ status: 'loading', message: '' })
  const ran = useRef(false) // links are single-use, so call the API only once

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    const token = params.get('token')
    if (!token) return setState({ status: 'error', message: 'This link is incomplete. Open it from the email again.' })
    api('/auth/verify-email', { method: 'POST', body: { token } })
      .then(() => setState({ status: 'ok' }))
      .catch((e) => setState({ status: 'error', message: e.message }))
  }, [params])

  return (
    <AuthShell title={state.status === 'ok' ? 'Email verified' : state.status === 'error' ? 'We could not verify your email' : 'Verifying your email…'}>
      {state.status === 'ok' && <>
        <p className="text-fg/75">Your account is active.</p>
        <Link to="/dashboard" className="btn-primary mt-6">Go to your dashboard</Link>
      </>}
      {state.status === 'error' && <>
        <p role="alert" className="text-signal">{state.message}</p>
        <Link to="/login" className="btn-ghost mt-6">Log in</Link>
      </>}
    </AuthShell>
  )
}
