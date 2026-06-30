import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/85 to-transparent px-5 py-4 md:px-12 md:py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight md:text-2xl">4th Ground</Link>
          <Link href="/" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20">Home</Link>
        </div>
      </header>

      <section className="relative flex min-h-[70svh] items-end overflow-hidden px-5 pb-14 pt-28 md:min-h-[75vh] md:px-12 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_35%),linear-gradient(to_top,#000,rgba(0,0,0,0.55),#000)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="mb-3 text-sm font-semibold tracking-wide text-zinc-400">4th Ground Privacy</p>
          <h1 className="max-w-4xl text-5xl font-bold leading-none tracking-tight md:text-8xl">Your Data</h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-300 md:text-xl">
            We only collect what we need to run 4th Ground and protect your account.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-12">
        <p className="mb-8 text-sm text-zinc-500">Last updated: June 2026 | 4th Ground, a division of KC Company Reg. No. 2023/664072/07. Controller under POPIA.</p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">1. What We Collect</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-400 list-disc pl-5">
              <li>Viewers: Email, name, billing info, rental history, IP, device data.</li>
              <li>Filmmakers: Email, banking/tax details, film performance, payout statements.</li>
              <li>Technical: Cookies, logs, DRM data, fraud signals.</li>
            </ul>
            <p className="mt-3 text-xs text-zinc-500">Payment card details are handled by our payment provider and not stored by us.</p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">2. Why We Use It</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-400 list-disc pl-5">
              <li>Provide TVOD rentals with 3-7 day access windows.</li>
              <li>Send receipts, rental access links, and support. Email is required for rentals.</li>
              <li>Process filmmaker payouts, tax, and accounting. Email is required for payouts.</li>
              <li>Prevent fraud, protect licensed content, comply with POPIA.</li>
            </ul>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">3. Licensed Content Only</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              All films, music, and artwork are fully licensed. "Coming soon" titles appear only after a license is secured.
              We do not host user uploads. Data is used only to deliver and protect licensed streams.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">4. Sharing & Processors</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              We share data only with: payment processors, CDN/DRM, email providers, and accountants.
              All are bound by POPIA and DPAs. We do not sell data. No advertising networks.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">5. Retention</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Viewer rental data: 7 years for tax/legal. Active account data: until deletion.
              Filmmaker payout data: 7 years for SARS compliance. Logs: 90 days.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">6. Your POPIA Rights</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Access, correct, delete, object, or request a copy of your data.
              Email <a href="mailto:support@4thground.com" className="underline">support@4thground.com</a> Subject: "POPIA Request".
              You can opt out of marketing, but not transactional emails for active rentals.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md md:col-span-3">
            <h2 className="text-xl font-bold">7. Security & Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              We use encryption, access controls, and audits. 4th Ground, a division of KC Company Reg. No. 2023/664072/07.
              Johannesburg, South Africa. Information Officer: <a href="mailto:support@4thground.com" className="underline">support@4thground.com</a>.
              See our <Link href="/cookies" className="underline">Cookie Policy</Link> and <Link href="/terms" className="underline">Terms</Link>.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border-white/10 bg-zinc-950 p-6 md:p-8">
          <h2 className="text-2xl font-bold">Privacy Contact</h2>
          <p className="mt-4 max-w-3xl text-zinc-400">
            4th Ground, a division of KC Company Reg. No. 2023/664072/07. Johannesburg, South Africa.
          </p>
          <a href="mailto:support@4thground.com" className="mt-3 inline-block text-lg font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white">
            support@4thground.com
          </a>
        </div>
      </section>

     <footer className="border-t border-white/10 px-6 md:px-12 py-10 text-sm text-zinc-500">
  <div className="max-w-7xl mx-auto space-y-6">
    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
      <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
      <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
      <Link href="/cookies" className="hover:text-white transition">Cookie Policy</Link>
      <Link href="/refund-policy" className="hover:text-white transition">Refund Policy</Link>
      <Link href="/dmca" className="hover:text-white transition">DMCA</Link>
      <Link href="/support" className="hover:text-white transition">Support</Link>
      <Link href="/contact" className="hover:text-white transition">Contact</Link>
    </div>

    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
      <p>© 2026 4th Ground. All rights reserved.</p>
      <p className="text-xs text-zinc-600">All content and trademarks are property of their respective owners.</p>
    </div>
  </div>
</footer>
    </main>
  )
}
