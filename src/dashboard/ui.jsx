import { timeAgo } from '../lib/time.js'

export const PageTitle = ({ title, intro }) => (
  <div className="mb-8"><h1 className="text-3xl font-bold">{title}</h1>{intro && <p className="mt-2 max-w-2xl text-fg/70">{intro}</p>}</div>
)
export const Card = ({ children, className = '' }) => <section className={`rounded-xl border border-line bg-surface p-5 ${className}`}>{children}</section>
export const Chip = ({ children }) => <li className="rounded-full border border-line px-3 py-1 text-sm">{children}</li>
export const Empty = ({ children }) => <p className="rounded-lg border border-dashed border-line px-4 py-8 text-center text-fg/60">{children}</p>

export const SEV = { critical: 'bg-signal', warning: 'bg-amber' }
export const AlertRow = ({ a }) => (
  <li className="flex gap-3 border-t border-line py-3 first:border-t-0">
    <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${SEV[a.severity]}`} />
    <div className="min-w-0"><p>{a.message}</p><p className="mt-0.5 text-xs text-fg/55">{a.system} · {timeAgo(a.createdAt)}</p></div>
  </li>
)

export const STATUS = { new: 'New', investigating: 'Investigating', resolved: 'Resolved', false_alarm: 'False alarm' }
const ORG_BADGE = { pending: 'bg-amber/15 text-amber', approved: 'bg-mint/15 text-mint', rejected: 'bg-signal/15 text-signal' }
export const OrgBadge = ({ status }) => <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${ORG_BADGE[status]}`}>{status}</span>
export const Stat = ({ label, value, tone = '' }) => (
  <Card><p className="text-sm text-fg/60">{label}</p><p className={`mt-1 font-display text-3xl font-bold ${tone}`}>{value}</p></Card>
)
