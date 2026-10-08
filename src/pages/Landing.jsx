import { Link } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import LiveFeed from '../components/LiveFeed.jsx'

const watches = [
  ['Account takeover', 'Logins from unusual places, devices or hours.'],
  ['Payment and transfer fraud', 'Sudden spikes, split transactions, changed payee details.'],
  ['Insider misuse', 'Staff or contractors touching data they never touch.'],
  ['Data theft', 'Bulk downloads and unexpected access to sensitive records.'],
  ['Records tampering', 'Edits to balances, grades or invoices with no approval.'],
]

const audience = [
  ['Banks and microfinance', 'Fraudulent transfers and takeover of customer or staff accounts.'],
  ['Hospitals and clinics', 'Patient records read or exported by people with no reason to.'],
  ['Universities and schools', 'Altered grades, fees and admission records.'],
  ['Government agencies', 'Ghost workers, diverted funds and leaked citizen data.'],
  ['Insurance firms', 'Fake claims and tampered policy records.'],
  ['Fintechs and payment providers', 'Unusual transaction volumes and API abuse.'],
  ['NGOs and cooperatives', 'Misused donor funds and altered member balances.'],
  ['Retail and logistics', 'Fake vendors, stock diversion and invoice fraud.'],
]

const steps = [
  ['Create your account', 'Answer a few questions about your institution, systems and worries.'],
  ['We build your dashboard', 'Only the modules and alert rules that fit your setup are switched on.'],
  ['We learn what normal looks like', 'Every system and user gets a baseline, so odd behaviour stands out.'],
  ['The right person is alerted', 'SMS, email or chat, within seconds, with what happened and where.'],
]

const benefits = [
  ['Act in minutes, not weeks', 'Fraud is usually found at the next audit. You find it while it is happening.'],
  ['Lose less', 'Stopping a transfer or locking an account early costs far less than recovering funds later.'],
  ['Fewer false alarms', 'Alerts compare behaviour against your own normal, not a generic rulebook.'],
  ['One view of every system', 'Banking, payroll, records and email feed one dashboard instead of five.'],
  ['Alerts that reach the right people', 'Route by severity and role so nobody is flooded and nothing is missed.'],
  ['A record you can show', 'Every alert and response is logged for auditors and regulators.'],
]

const Section = ({ id, title, intro, children, tint }) => (
  <section id={id} className={`border-t border-line ${tint ? 'bg-surface' : ''}`}>
    <div className="mx-auto max-w-6xl px-5 py-20">
      <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 max-w-2xl text-fg/70">{intro}</p>}
      <div className="mt-10">{children}</div>
    </div>
  </section>
)

export default function Landing() {
  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Logo />
          <nav className="flex items-center gap-2 text-sm font-medium">
            <a href="#about" className="hidden px-3 py-2 hover:text-cyan lg:block">About</a>
            <a href="#who" className="hidden px-3 py-2 hover:text-cyan lg:block">Who it’s for</a>
            <a href="#how" className="hidden px-3 py-2 hover:text-cyan lg:block">How it helps</a>
            <a href="#benefits" className="hidden px-3 py-2 hover:text-cyan lg:block">Benefits</a>
            <Link to="/login" className="btn-ghost">Log in</Link>
            <Link to="/signup" className="btn-primary">Get started</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero: text + image */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-12 lg:grid-cols-[1.2fr_1fr] lg:pt-20">
          <div>
            <h1 className="text-hero font-bold">When something looks wrong, your team hears about it first.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg/75">
              AbiSentry Gossip watches your systems for fraud and malicious activity and passes the word to the right people within seconds, before the damage spreads.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="btn-primary">Get started</Link>
              <a href="#about" className="btn-ghost">Learn more</a>
            </div>
            <p className="mt-4 text-sm text-fg/60">Setup takes about five minutes. No system access needed to start.</p>
          </div>
          <div className="flex justify-center">
            <img src="/logo.jpg" alt="AbiSentry shield with an orbiting ribbon" className="w-full max-w-md mix-blend-lighten drop-shadow-[0_0_60px_rgba(47,212,247,0.25)]" />
          </div>
        </section>

        {/* 1. About */}
        <Section id="about" tint title="What AbiSentry Gossip is"
          intro="A fraud alert platform for institutions. It connects to the systems where your money, records and accounts live, learns how they normally behave, and tells you straight away when something does not fit.">
          <dl className="divide-y divide-line">
            {watches.map(([t, d]) => (
              <div key={t} className="grid gap-1 py-4 sm:grid-cols-[15rem_1fr] sm:gap-6">
                <dt className="font-display text-lg font-bold">{t}</dt>
                <dd className="text-fg/70">{d}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* 2. Who it's for */}
        <Section id="who" title="Who it is for" intro="Any institution that holds money, data or public trust, and needs to know quickly when someone abuses access to it.">
          <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {audience.map(([t, d]) => (
              <li key={t} className="border-l-2 border-cyan pl-4">
                <h3 className="font-display text-lg font-bold">{t}</h3>
                <p className="mt-1 text-sm text-fg/70">{d}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* 3. How it helps */}
        <Section id="how" tint title="How it helps you">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <ol className="space-y-6">
              {steps.map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-display text-sm font-bold text-bg">{i + 1}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold leading-snug">{t}</h3>
                    <p className="mt-1 text-sm text-fg/70">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <LiveFeed />
          </div>
        </Section>

        {/* 4. Benefits */}
        <Section id="benefits" title="Why institutions choose it">
          <dl className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {benefits.map(([t, d]) => (
              <div key={t}>
                <dt className="font-display text-lg font-bold">{t}</dt>
                <dd className="mt-1 text-fg/70">{d}</dd>
              </div>
            ))}
          </dl>
          <Link to="/signup" className="btn-primary mt-12">Get started</Link>
        </Section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm text-fg/60">
          <Logo size="h-9" />
          <p>© {new Date().getFullYear()} AbiSentry Gossip</p>
        </div>
      </footer>
    </div>
  )
}
