import { NextResponse } from 'next/server'
import crypto from 'crypto'

const KEY = process.env.BUNNY_TOKEN_KEY!

export async function POST(req: Request) {
  const { libraryId, videoId, type, paidAt, isTrailer } = await req.json()

  if (!libraryId || !videoId) return NextResponse.json({ error: 'Missing ids' }, { status: 400 })

  const expires = isTrailer 
   ? Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24hr trailer
    : type === 'buy' 
     ? Math.floor(Date.now() / 1000) + 100 * 365 * 24 * 60 * 60 // 100 years
      : Math.floor(paidAt / 1000) + 7 * 24 * 60 * 60 // 7 days

  if (expires < Math.floor(Date.now() / 1000)) {
    return NextResponse.json({ error: 'Expired' }, { status: 403 })
  }

  const hash = crypto.createHash('sha256').update(`${KEY}${libraryId}${videoId}${expires}`).digest('hex')
  const src = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${hash}&expires=${expires}&autoplay=true&preload=true`
  
  return NextResponse.json({ src })
}
