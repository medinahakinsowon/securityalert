import { useOutletContext } from 'react-router-dom'
import { PageTitle, Card } from './ui.jsx'
import { fraudTypes } from '../data/knowledge.js'

export default function Playbooks() {
  const { organisation: org } = useOutletContext()
  const mine = org?.profile?.threats || []
  const sorted = [...fraudTypes].sort((a, b) => mine.includes(b.threat) - mine.includes(a.threat))

  return (
    <>
      <PageTitle title="Playbooks and response guides" intro="What to do, step by step, when an alert fires. Your priority threats are listed first." />
      <div className="max-w-3xl space-y-3">
        {sorted.map((f) => (
          <Card key={f.threat} className="!p-0">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5">
                <span className="font-display text-lg font-bold">{f.threat}</span>
                {mine.includes(f.threat) && <span className="rounded-full bg-cyan/15 px-2.5 py-0.5 text-xs text-cyan">Your priority</span>}
              </summary>
              <ol className="list-decimal space-y-2 border-t border-line px-10 py-5 text-fg/80">{f.steps.map((s) => <li key={s}>{s}</li>)}</ol>
            </details>
          </Card>
        ))}
      </div>
    </>
  )
}
