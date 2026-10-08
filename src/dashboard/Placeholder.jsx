import { PageTitle, Card } from './ui.jsx'

// For modules that need real data before they can show anything.
export default function Placeholder({ title, intro, status, points }) {
  return (
    <>
      <PageTitle title={title} intro={intro} />
      <Card className="max-w-2xl">
        <p className="font-display text-lg font-bold">{status}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-fg/75">{points.map((p) => <li key={p}>{p}</li>)}</ul>
      </Card>
    </>
  )
}
