import { useEffect, useState } from 'react'

const EVENTS = [
  { sev: 'critical', sys: 'Core banking', msg: '14 failed admin logins from a new country in 40 seconds' },
  { sev: 'warning', sys: 'Payroll', msg: 'Bank details changed on 3 staff records outside work hours' },
  { sev: 'critical', sys: 'Payments API', msg: 'Transfer volume 9x above this account’s normal pattern' },
  { sev: 'warning', sys: 'Student records', msg: 'Grades edited by a user who has never edited grades' },
  { sev: 'critical', sys: 'Patient database', msg: 'Bulk export of 22,000 records by a contractor account' },
  { sev: 'warning', sys: 'Procurement', msg: 'Vendor added and paid within 6 minutes, no approval logged' },
]
const COLORS = { critical: 'bg-signal', warning: 'bg-amber' }

export default function LiveFeed() {
  const [items, setItems] = useState([{ ...EVENTS[0], id: 0, at: 'just now' }])

  useEffect(() => {
    let i = 1
    const t = setInterval(() => {
      setItems((prev) => [{ ...EVENTS[i % EVENTS.length], id: i, at: 'just now' }, ...prev.map((p) => ({ ...p, at: 'earlier' }))].slice(0, 4))
      i++
    }, 2800)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="rounded-xl border border-line bg-surface p-5 text-fg" aria-label="Example live alert feed">
      <div className="mb-4 flex items-center justify-between text-sm text-white/60">
        <span>Live alerts, example institution</span>
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-mint" />Monitoring</span>
      </div>
      <ul className="space-y-3" aria-live="polite">
        {items.map((e) => (
          <li key={e.id} className="flex gap-3 rounded-lg bg-white/[0.06] p-3.5 motion-safe:animate-arrive">
            <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${COLORS[e.sev]}`} />
            <div className="min-w-0">
              <p className="text-[15px] leading-snug">{e.msg}</p>
              <p className="mt-1 text-xs text-white/50">{e.sys} · {e.at}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
