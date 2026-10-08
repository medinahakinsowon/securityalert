import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import { api } from '../lib/api.js'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setError('') }

  const submit = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address.')
    if (!form.password) return setError('Enter your password.')
    setBusy(true)
    try { await api('/auth/login', { method: 'POST', body: form }); navigate('/dashboard') }
    catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
      <Logo />
      <h1 className="mt-10 text-3xl font-bold">Log in to your dashboard</h1>
      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">Work email</label>
          <input id="email" type="email" autoComplete="email" className="field" value={form.email} onChange={set('email')} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">Password</label>
          <input id="password" type="password" autoComplete="current-password" className="field" value={form.password} onChange={set('password')} />
          <Link to="/forgot-password" className="mt-2 inline-block text-sm text-cyan hover:underline">Forgot your password?</Link>
        </div>
        {error && <p role="alert" className="text-sm text-signal">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
      </form>
      <p className="mt-6 text-sm text-fg/70">New to AbiSentry Gossip? <Link to="/signup" className="font-semibold text-cyan hover:underline">Get started</Link></p>
    </div>
  )
}
