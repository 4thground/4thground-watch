'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import films from '@/data/films.json'

const ZAR_TO_USD_RATE = 16.2
const zarToUsd = (zarCents: number) => ((zarCents / 100) / ZAR_TO_USD_RATE).toFixed(2)

type ExternalResult = {
  type: 'external' | 'none'
  title?: string
  director?: string
  plot?: string
  poster?: string | null
  filmmakerNoFilms?: boolean
}

export default function Home() {
  const [search, setSearch] = useState('')
  const [externalResult, setExternalResult] = useState<ExternalResult | null>(null)
  const [loadingExternal, setLoadingExternal] = useState(false)
  const featured = films[0]

  // Filter for search + split available vs coming soon
  const filteredFilms = films.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.cast?.some(c => c.toLowerCase().includes(search.toLowerCase())) ||
    f.director?.toLowerCase().includes(search.toLowerCase())
  )

  const availableFilms = filteredFilms.filter(f => f.available)
  const comingSoonFilms = filteredFilms.filter(f =>!f.available)

  // Fallback external search when local = 0
  useEffect(() => {
    const run = async () => {
      if (!search.trim() || filteredFilms.length > 0) {
        setExternalResult(null)
        return
      }

      setLoadingExternal(true)
      setExternalResult(null)
      try {
        const res = await fetch(`/api/external-search?q=${encodeURIComponent(search)}`)
        const data = await res.json()
        setExternalResult(data)
      } catch {
        setExternalResult({ type: 'none' })
      } finally {
        setLoadingExternal(false)
      }
    }

    const t = setTimeout(run, 500) // debounce 500ms
    return () => clearTimeout(t)
  }, [search, filteredFilms.length])

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Search Bar - Fixed top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent px-6 md:px-12 py-4">
        <div className="max-w-
