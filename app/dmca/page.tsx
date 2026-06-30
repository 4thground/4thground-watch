import Link from 'next/link'
export default function DMCAPage() {
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
          <p className="mb-3 text-sm font-semibold tracking-wide text-zinc-400">4th Ground DMCA</p>
          <h1 className="max-w-4xl text-5xl font-bold leading-none tracking-tight md:text-8xl">Copyright</h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-300 md:text-xl">
            Report or dispute copyright infringement on 4th Ground.
          </p>
        </div>
      </section>
      
         <section className="mx-auto max-w-7xl px-5 pb-20 md:px-12">
        <p className="mb-8 text-sm text-zinc-500">Last updated: June 2026 | 4th Ground, a division of KC Company Reg. No. 2023/664072/07</p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">1. Licensed Platform Only</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              4th Ground streams only films we have legally licensed, including all music, artwork, and ancillary rights.
              We do not host user uploads. "Coming soon" titles are listed only after a license is secured.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">2. File a Copyright Notice</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Send a written notice to <a href="mailto:support@4thground.com" className="underline">support@4thground.com</a> with Subject: "DMCA Notice". 
              Include: 1. Copyrighted work description. 2. Infringing URL on 4th Ground. 3. Your name, address, phone, email. 
              4. Good faith statement. 5. Perjury statement. 6. Physical or e-signature.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">3. Takedown & Account Action</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              On receipt of a valid notice, we will investigate and remove or disable access to the material without delay.
              We will notify the account holder. Repeat infringers may have accounts terminated per our Terms.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">4. Counter-Notification</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              If you believe content was removed in error, send a counter-notice to the same email with Subject: "DMCA Counter-Notice".
              Include: ID of removed material, perjury statement, consent to jurisdiction, and your contact details.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">5. Restoration Timeline</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              After a valid counter-notice, we will notify the original complainant. 
              If we do not receive notice of legal action within 10-14 business days, we may restore the content.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">6. Misrepresentation</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Under 17 U.S.C. §512(f), anyone who knowingly misrepresents infringement or removal may be liable for damages and costs.
              Submit notices in good faith only.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md md:col-span-3">
            <h2 className="text-xl font-bold">7. Designated Agent & Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              4th Ground, a division of KC Company Reg. No. 2023/664072/07, Johannesburg, South Africa.
              All DMCA notices: <a href="mailto:support@4thground.com" className="underline">support@4thground.com</a> Subject: "DMCA Notice".
              For other copyright issues: <Link href="/support" className="underline">Support</Link>.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border-white/10 bg-zinc-950 p-6 md:p-8">
          <h2 className="text-2xl font-bold">Important Notes</h2>
          <p className="mt-4 max-w-3xl text-zinc-400">
            This policy applies to 4th Ground only. We cannot act on third-party sites. 
            If you are not the copyright owner or authorized agent, do not submit a notice.
          </p>
          <div className="mt-5 flex-wrap gap-4 text-sm">
            <Link href="/terms" className="text-zinc-400 hover:text-white underline">Terms of Service</Link>
            <Link href="/privacy" className="text-zinc-400 hover:text-white underline">Privacy Policy</Link>
            <Link href="/contact" className="text-zinc-400 hover:text-white underline">Contact</Link>
          </div>
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
