import Logo from './Logo.jsx'

export default function AuthShell({ title, children }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
      <Logo />
      <h1 className="mt-10 text-3xl font-bold">{title}</h1>
      <div className="mt-6">{children}</div>
    </div>
  )
}
