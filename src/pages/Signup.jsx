import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import { steps } from '../data/questions.js'
import { api } from '../lib/api.js'

const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v)

function validate(step, answers) {
  const errs = {}
  for (const f of step.fields) {
    const v = answers[f.name]
    if (f.required && (v === undefined || v === '' || (Array.isArray(v) && !v.length))) {
      errs[f.name] = f.type === 'multi' ? 'Choose at least one option.' : 'This field is required.'
    } else if (f.type === 'email' && !emailOk(v)) errs[f.name] = 'Enter a valid email address.'
    else if (f.min && v.length < f.min) errs[f.name] = `Use at least ${f.min} characters.`
  }
  return errs
}

function Chips({ field, value, onChange }) {
  const multi = field.type === 'multi'
  const isOn = (o) => (multi ? (value || []).includes(o) : value === o)
  const toggle = (o) => onChange(multi ? (isOn(o) ? value.filter((x) => x !== o) : [...(value || []), o]) : o)
  return (
    <div className="flex flex-wrap gap-2" role={multi ? 'group' : 'radiogroup'} aria-label={field.label || 'Options'}>
      {field.options.map((o) => (
        <button type="button" key={o.value} onClick={() => toggle(o.value)} aria-pressed={isOn(o.value)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${isOn(o.value) ? 'border-cyan bg-cyan text-bg' : 'border-line bg-surface hover:border-cyan'}`}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Field({ field, value, error, onChange }) {
  const id = `f-${field.name}`
  return (
    <div>
      {field.label && <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{field.label}</label>}
      {field.type === 'select' ? (
        <select id={id} className="field" value={value || ''} onChange={(e) => onChange(e.target.value)}>
          <option value="">Choose one</option>
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : field.type === 'multi' || field.type === 'single' ? (
        <Chips field={field} value={value} onChange={onChange} />
      ) : (
        <input id={id} className="field" type={field.type} value={value || ''} autoComplete={field.autoComplete}
          onChange={(e) => onChange(e.target.value)} />
      )}
      {field.help && !error && <p className="mt-1.5 text-xs text-fg/60">{field.help}</p>}
      {error && <p role="alert" className="mt-1.5 text-sm text-signal">{error}</p>}
    </div>
  )
}

export default function Signup() {
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const step = steps[i]
  const last = i === steps.length - 1

  const set = (name) => (v) => { setAnswers((a) => ({ ...a, [name]: v })); setErrors((e) => ({ ...e, [name]: undefined })) }

  const next = async (e) => {
    e.preventDefault()
    const errs = validate(step, answers)
    setErrors(errs)
    if (Object.keys(errs).length) return
    if (!last) return setI(i + 1)
    const { fullName, email, password, orgName, orgType, orgSize, country, ...profile } = answers
    setSubmitting(true); setFormError('')
    try {
      await api('/auth/signup', { method: 'POST', body: { fullName, email, password, orgName, orgType, orgSize, country, profile } })
      setDone(true)
    } catch (err) {
      setFormError(err.message)
      if (err.fields) {
        setErrors(err.fields)
        const back = steps.findIndex((s) => s.fields.some((f) => err.fields[f.name]))
        if (back >= 0) setI(back)
      }
    } finally { setSubmitting(false) }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <Logo />
        <h1 className="mt-12 text-4xl font-bold">Check your email, {answers.fullName.split(' ')[0]}.</h1>
        <p className="mt-4 text-fg/70">
          We sent a verification link to <b>{answers.email}</b>. Open it to activate your account. Your {answers.orgName} dashboard is already being prepared from your answers. Our team reviews every institution before system connections are switched on, and we will email you once that is done.
        </p>
        <Link to="/dashboard" className="btn-primary mt-8">Continue</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[22rem_1fr]">
      <aside className="bg-surface px-6 py-8 text-white lg:px-8 lg:py-10">
        <Logo />
        <ol className="mt-8 flex gap-2 lg:mt-14 lg:flex-col lg:gap-5">
          {steps.map((s, n) => (
            <li key={s.id} className={`flex items-center gap-3 text-sm ${n === i ? 'font-semibold text-white' : n < i ? 'text-white/80' : 'text-white/40'}`} aria-current={n === i ? 'step' : undefined}>
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs ${n < i ? 'border-mint bg-mint text-bg' : n === i ? 'border-white' : 'border-white/30'}`}>
                {n < i ? '✓' : n + 1}
              </span>
              <span className="hidden lg:inline">{s.title}</span>
            </li>
          ))}
        </ol>
      </aside>

      <main className="px-5 py-10 lg:px-16 lg:py-16">
        <form onSubmit={next} noValidate className="mx-auto max-w-xl">
          <p className="text-sm text-fg/60">Question {i + 1} of {steps.length}</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{step.title}</h1>
          <p className="mt-2 text-fg/70">{step.hint}</p>
          <div className="mt-8 space-y-6">
            {step.fields.map((f) => <Field key={f.name} field={f} value={answers[f.name]} error={errors[f.name]} onChange={set(f.name)} />)}
          </div>
          {formError && <p role="alert" className="mt-6 text-sm text-signal">{formError}</p>}
          <div className="mt-10 flex items-center justify-between">
            {i > 0 ? <button type="button" className="btn-ghost" onClick={() => setI(i - 1)}>Back</button> : <Link to="/" className="btn-ghost">Cancel</Link>}
            <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Creating your account…' : last ? 'Create my dashboard' : 'Continue'}</button>
          </div>
        </form>
      </main>
    </div>
  )
}
