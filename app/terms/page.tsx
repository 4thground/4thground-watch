import Link from 'next/link'

export default function TermsPage() {
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
      <section className="relative flex min-h-[60svh] items-end overflow-hidden px-5 pb-14 pt-28 md:min-h-[65vh] md:px-12 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_35%),linear-gradient(to_top,#000,rgba(0,0,0,0.65),#000)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="mb-3 text-sm font-semibold tracking-wide text-zinc-400">
            4th Ground
          </p>

          <h1 className="max-w-4xl text-5xl font-bold leading-none tracking-tight md:text-8xl">
            Terms of Use
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-300 md:text-xl">
            These terms explain how you may access and use 4th Ground’s TVOD film service.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="mx-auto max-w-4xl px-5 pb-20 md:px-12">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md md:p-10">
          <p className="text-sm text-zinc-500">Last updated: June 2026</p>

          <div className="mt-8 space-y-8 text-zinc-300">
            <div>
              <h2 className="text-2xl font-bold text-white">1. About 4th Ground</h2>
              <p className="mt-3 leading-relaxed">
                4th Ground is a film distribution and digital viewing platform. At this stage,
                4th Ground operates as a TVOD service, meaning users may rent or buy individual
                films where available. We do not currently offer a subscription plan.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">2. Rentals and Purchases</h2>
              <p className="mt-3 leading-relaxed">
                When you rent or purchase a film on 4th Ground, you receive a limited,
                personal, non-transferable viewing right for that film. The content is provided
                for private viewing only and may not be copied, resold, shared, uploaded,
                broadcast, or distributed without permission.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">3. Availability</h2>
              <p className="mt-3 leading-relaxed">
                Film availability may vary depending on licensing, territory, technical
                requirements, and platform decisions. Some films may be available for rental,
                purchase, or may be listed as coming soon.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">4. Payments</h2>
              <p className="mt-3 leading-relaxed">
                Prices are shown before checkout. By completing a transaction, you agree to pay
                the listed price for the selected film access. Payment processing may be handled
                by third-party payment providers.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">5. Refunds</h2>
              <p className="mt-3 leading-relaxed">
                If you experience a technical issue that prevents access to a rented or purchased
                film, contact us at support@4thground.com. Refund requests are reviewed on a
                case-by-case basis.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">6. User Responsibilities</h2>
              <p className="mt-3 leading-relaxed">
                You agree not to misuse the platform, attempt to bypass payment or access controls,
                copy or record films, share private viewing links, interfere with the service,
                or use 4th Ground for unlawful activity.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">7. Intellectual Property</h2>
              <p className="mt-3 leading-relaxed">
                All films, artwork, trailers, logos, page designs, and related materials remain
                the property of 4th Ground, its licensors, filmmakers, or rights holders. No
                ownership rights are transferred to you through rental or purchase.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">8. Service Changes</h2>
              <p className="mt-3 leading-relaxed">
                4th Ground may update, remove, pause, or modify parts of the service when needed,
                including film pages, pricing, availability, features, and technical functionality.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">9. Contact</h2>
              <p className="mt-3 leading-relaxed">
                For questions about these terms, payments, access, or support, contact us at{' '}
                <a
                  href="mailto:support@4thground.com"
                  className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
                >
                  support@4thground.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-zinc-600">
          
        </p>
      </section>

      {/* Footer */}
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
