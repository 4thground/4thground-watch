import Link from 'next/link'

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
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

      {/* Hero */}
      <section className="relative flex min-h-[70svh] items-end overflow-hidden px-5 pb-14 pt-28 md:min-h-[75vh] md:px-12 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_35%),linear-gradient(to_top,#000,rgba(0,0,0,0.55),#000)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="mb-3 text-sm font-semibold tracking-wide text-zinc-400">
            4th Ground Support
          </p>

          <h1 className="max-w-4xl text-5xl font-bold leading-none tracking-tight md:text-8xl">
            How can we help?
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-300 md:text-xl">
            Need help with renting, buying, watching, payments, or your film access?
            Our support team is here to assist you.
          </p>

          <a
            href="mailto:support@4thground.com"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-black transition hover:bg-zinc-200 md:text-lg"
          >
            Email Support
          </a>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-12">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">Watching a Film</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              If your rented or purchased film is not playing correctly, please email us with
              the film title, the device you are using, and a short description of the issue.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">Payments</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              For payment questions, failed transactions, duplicate charges, or access problems
              after payment, contact us and include the email address used for the purchase.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">TVOD Access</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              4th Ground currently operates as a TVOD platform. This means you rent or buy
              individual films. We do not currently offer a subscription service.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-zinc-950 p-6 md:p-8">
          <h2 className="text-2xl font-bold">Contact</h2>

          <p className="mt-4 max-w-3xl text-zinc-400">
            For support, please email:
          </p>

          <a
            href="mailto:support@4thground.com"
            className="mt-3 inline-block text-lg font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white"
          >
            support@4thground.com
          </a>

          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-zinc-500">
            Please include your name, email address used on 4th Ground, the film title,
            and any screenshots or details that can help us understand the issue.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-5 py-8 text-sm text-zinc-500 md:px-12 md:py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
          <p>© 2026 4th Ground. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/support" className="transition hover:text-white">
              Support
            </Link>

            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
