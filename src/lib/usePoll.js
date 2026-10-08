import { useEffect } from 'react'

// Runs `fn` now and every `ms` while the tab is visible. This is what makes alerts appear without a refresh.
export function usePoll(fn, ms, deps = []) {
  useEffect(() => {
    fn()
    const t = setInterval(() => { if (!document.hidden) fn() }, ms)
    return () => clearInterval(t)
  }, deps) // eslint-disable-line
}
