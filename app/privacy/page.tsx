import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/85 to-transparent px-5 py-4 md:px-12 md:py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight md:text-2xl">
            4th Ground
          </Link>
          <Link
            href="/"
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
          >
            Home
          </Link>
        </div>
      </header>

      <section className="relative flex min-h-[60svh] items-end overflow-hidden px-5 pb-14 pt-28 md:min-h-[65vh] md:px-12 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_35%),linear-gradient(to_top,#000,rgba(0,0,0,0.65),#000)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="mb-3 text-sm font-semibold tracking-wide text-zinc-400">
            4th Ground
          </p>
          <h1 className="max-w-4xl text-5xl font-bold leading-none tracking-tight md:text-8xl">
            Privacy Policy
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-300 md:text-xl">
            How we collect, use, and protect your data on 4th Ground.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-20 md:px-12">
        <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md md:p-10">
          <p className="text-sm text-zinc-500">Last updated: 2026</p>
          <div className="mt-8 space-y-8 text-zinc-300">
            <div>
              <h2 className="text-2xl font-bold text-white">1. Data We Collect</h2>
              <p className="mt-3 leading-relaxed">
                We collect account info, payment data via our payment processor, device info, and viewing history to operate and improve 4th Ground.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">2. How We Use Data</h2>
              <p className="mt-3 leading-relaxed">
                To process rentals/purchases, prevent fraud, provide support, and comply with legal obligations. We do not sell personal data.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">3. Your Rights</h2>
              <p className="mt-3 leading-relaxed">
                You can request access, correction, or deletion of your data by contacting support@4thground.com.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">4. Contact</h2>
              <p className="mt-3 leading-relaxed">
                Questions about privacy? Email{' '}
                <a href="mailto:support@4thground.com" className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
                  support@4thground.com
                </a>
               .
              </p>
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-xs leading-relaxed text-zinc-600">
          Have a legal professional review before launch.
        </p>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-sm text-zinc-500 md:px-12 md:py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
          <p>© 2026 4th Ground. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/support" className="transition hover:text-white">Support</Link>
            <Link href="/terms" className="transition hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
