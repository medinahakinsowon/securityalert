import { useState } from 'react'
import { PageTitle, Card } from './ui.jsx'
import { fraudTypes } from '../data/knowledge.js'

export default function Library() {
  const [q, setQ] = useState('')
  const term = q.trim().toLowerCase()
  const hits = fraudTypes.filter((f) => !term || [f.threat, f.summary, ...f.signs].join(' ').toLowerCase().includes(term))

  return (
    <>
      <PageTitle title="Fraud library" intro="Learn how each type of fraud works and the warning signs to look for." />
      <label htmlFor="lib-search" className="sr-only">Search the fraud library</label>
      <input id="lib-search" className="field mb-6 max-w-lg" placeholder="Search, for example “vendor” or “export”" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid gap-4 lg:grid-cols-2">
        {hits.map((f) => (
          <Card key={f.threat}>
            <h2 className="font-display text-xl font-bold">{f.threat}</h2>
            <p className="mt-1 text-fg/75">{f.summary}</p>
            <p className="mt-4 text-sm font-semibold">Warning signs</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-fg/75">{f.signs.map((s) => <li key={s}>{s}</li>)}</ul>
          </Card>
        ))}
        {!hits.length && <p className="text-fg/70">Nothing matches “{q}”. Try a shorter word.</p>}
      </div>
    </>
  )
}
