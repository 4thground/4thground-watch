import { NextResponse } from 'next/server'
import crypto from 'crypto'
import films from '@/data/films.json' // <-- Pull from your json

const GITHUB_API = 'https://api.github.com'
const REPO = process.env.GITHUB_REPO! 
const TOKEN = process.env.GITHUB_TOKEN! 
const HOST = process.env.BUNNY_PULL_ZONE_HOST! // https://yourzone.b-cdn.net
const KEY = process.env.BUNNY_TOKEN_KEY!

const signBunny = (path: string, exp: number) => 
  `${HOST}${path}?token=${crypto.createHash('sha256').update(`${KEY}${path}${exp}`).digest('base64url')}&expires=${exp}`

const ghHeaders = { 
  'Authorization': `Bearer ${TOKEN}`, 
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28'
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const filmId = searchParams.get('filmId')!
    const email = searchParams.get('email')!
    if(!filmId || !email) return NextResponse.json({ error: 'Missing filmId or email' }, { status: 400 })

    const film = (films as any[]).find((f) => f.id === filmId) // <-- Get film
    if(!film) return NextResponse.json({ error: 'Film not found' }, { status: 404 })

    const bunnyVideoId = film.bunny_video_id // <-- Use your field
    const filePath = `rentals/${email}_${filmId}.json`
    const now = Date.now()

    // 1. Check Github for existing rental
    const get = await fetch(`${GITHUB_API}/repos/${REPO}/contents/${filePath}`, { headers: ghHeaders })
    
    if(get.ok) {
      const { content } = await get.json()
      const data = JSON.parse(Buffer.from(content, 'base64').toString())
      if(data.expires > now) { // Still valid
        const url = signBunny(`/library/${bunnyVideoId}/play`, Math.floor(data.expires/1000)) // <-- No library id
        return NextResponse.json({ url, exp: Math.floor(data.expires/1000) })
      }
    }

    // 2. No file or expired = Create new 7 day rental
    const expires = now + 7 * 24 * 60 * 60 * 1000
    const newFile = { email, filmId, expires, created_at: now }
    
    await fetch(`${GITHUB_API}/repos/${REPO}/contents/${filePath}`, {
      method: 'PUT',
      headers: { ...ghHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Rent: ${filmId} for ${email}`,
        content: Buffer.from(JSON.stringify(newFile)).toString('base64')
      })
    })

    const url = signBunny(`/library/${bunnyVideoId}/play`, Math.floor(expires/1000)) // <-- No library id
    return NextResponse.json({ url, exp: Math.floor(expires/1000) })

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
