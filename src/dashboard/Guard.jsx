import { useOutletContext } from 'react-router-dom'

// Hides a page from roles that lack the permission. The server enforces the same rule on every request.
export default function Guard({ perm, children }) {
  const { organisation } = useOutletContext()
  return organisation?.permissions?.includes(perm)
    ? children
    : <p className="max-w-xl text-fg/70">Your role does not include this page. Ask an administrator of your institution if you need access.</p>
}

export function AdminGuard({ children }) {
  const { user } = useOutletContext()
  return user.isAdmin ? children : <p className="max-w-xl text-fg/70">This page is only for AbiSentry administrators.</p>
}
