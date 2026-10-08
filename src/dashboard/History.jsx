import { timeAgo } from '../lib/time.js'

const WHAT = { new: 'Reopened', investigating: 'Started investigating', resolved: 'Resolved', false_alarm: 'Marked as a false alarm' }

// The record of what people did about an alert, including the note they left.
export default function History({ history = [] }) {
  if (!history.length) return <p className="text-sm text-fg/50">No action has been taken yet.</p>
  return (
    <ol className="space-y-3">
      {history.map((h, i) => (
        <li key={i} className="border-l-2 border-line pl-3 text-sm">
          <p><b>{h.by}</b> · {WHAT[h.status]} · <span className="text-fg/50">{timeAgo(h.at)}</span></p>
          {h.note && <p className="mt-1 text-fg/75">“{h.note}”</p>}
        </li>
      ))}
    </ol>
  )
}
