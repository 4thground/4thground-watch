import { NextResponse } from 'next/server'
import crypto from 'crypto'

const KEY = process.env.BUNNY_TOKEN_KEY!

export async function POST(req: Request) {
  const { libraryId, videoId, isTrailer, paidAt, type } = await req.json()
  if(!libraryId ||!videoId) return NextResponse.json({ error: 'Missing' }, { status: 400 })

  const now = Math.floor(Date.now() / 1000)
  const expires = isTrailer 
  ? now + 24 * 60 * 60 // 24hr trailer
    : type === 'buy' 
    ? now + 100 * 365 * 24 * 60 * 60 // 100 years
      : Math.floor(paidAt / 1000) + 7 * 24 * 60 * 60 // 7 days

  const hash = crypto.createHash('sha256').update(`${KEY}${libraryId}${videoId}${expires}`).digest('hex')
  const src = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${hash}&expires=${expires}&autoplay=true&preload=true`
  return NextResponse.json({ src })
}
