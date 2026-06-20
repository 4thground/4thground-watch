import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-8 text-sm text-zinc-500 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
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
  )
}
