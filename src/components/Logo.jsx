import { Link } from 'react-router-dom'

// logo.jpg has a black background; mix-blend-lighten lets it sit cleanly on the dark page.
export default function Logo({ size = 'h-11' }) {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-fg">
      <img src="/logo.jpg" alt="" className={`${size} w-auto mix-blend-lighten`} />
      Abisentry Gossip
    </Link>
  )
}
