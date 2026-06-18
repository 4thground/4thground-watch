'use client'
import { useState } from 'react'
import Link from 'next/link'
import films from '@/data/films.json'

const ZAR_TO_USD_RATE = 18.5
const zarToUsd = (zarCents: number) => ((zarCents / 100) / ZAR_TO_USD_RATE).toFixed(2)

export default function Home() {
  const [search, setSearch] = useState('')
  const featured = films[0]

  // Filter for search + split available vs coming soon
  const filteredFilms = films.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.cast?.some(c => c.toLowerCase().includes(search.toLowerCase())) ||
    f.director?.toLowerCase().includes(search.toLowerCase())
  )
  const availableFilms = filteredFilms.filter(f => f.available)
  const comingSoonFilms = filteredFilms.filter(f =>!f.available)

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Search Bar - Fixed top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-bold tracking-tight">4th Ground</Link>
          <input
            type="text"
            placeholder="Search films, cast, director..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full w-full max-w-md text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[100svh] w-full pt-16">
        <img
          src={featured.poster_url}
          className="absolute inset-0 w-full h-full object-cover object-top"
          alt={featured.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute bottom-6 left-6 md:left-12 max-w-2xl pr-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-3 tracking-tight">{featured.title}</h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-300 mb-3">
            {featured.rating && <span className="px-1.5 py-0.5 border border-zinc-500 rounded text-xs">{featured.rating}</span>}
            {featured.year && <span>{featured.year}</span>}
            {featured.genre && <span>•</span>}
            {featured.genre && <span>{featured.genre}</span>}
            {featured.language && <span>•</span>}
            {featured.language && <span>{featured.language}</span>}
            <span>•</span>
            <span>HD</span>
          </div>

          {/* Cast & Director */}
          {featured.director && (
            <p className="text-zinc-300 mb-1 text-sm">
              <span className="text-zinc-500">Director:</span> {featured.director}
            </p>
          )}
          {featured.cast && featured.cast.length > 0 && (
            <p className="text-zinc-300 mb-3 text-sm">
              <span className="text-zinc-500">Starring:</span> {featured.cast.join(', ')}
            </p>
          )}

          <p className="text-sm text-zinc-200 mb-5 max-w-xl leading-relaxed line-clamp-2">{featured.description}</p>

          <Link
            href={`/film/${featured.id}`}
            class
