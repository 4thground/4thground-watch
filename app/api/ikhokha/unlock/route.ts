import { NextResponse } from 'next/server'
import films from '@/data/films.json'

const GITHUB_API = 'https://api.github.com'
const REPO = process.env.GITHUB_REPO! 
const TOKEN = process.env.GITHUB_TOKEN! 

const ghHeaders = { 
  'Authorization': `Bearer ${TOKEN}`, 
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28'
}

// 1. GATEKEEPER: Check if iKhokha says they paid
// Best way: iKhokha webhook writes `paid/${email}_${filmId}.json` when success
async function hasPaid(email: string, filmId: string): Promise<boolean> {
  const paidFile = `paid/${email}_${filmId}.json`
  const res = await fetch(`${GITHUB_API}/repos/${REPO}/contents/${paidFile}`, { headers: ghHeaders, cache: 'no-store' })
  return res.ok
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const filmId = searchParams.get('filmId')!
    const email = searchParams.get('email')!
    if(!filmId || !email) return NextResponse.json({ error: 'Missing' }, { status: 400 })

    const film = (films as any[]).find((f) => f.id === filmId)
    if(!film) return NextResponse.json({ error: 'Film not found' }, { status: 404 })

    // 2. BLOCK IF NOT PAID
    const paid = await hasPaid(email, filmId)
    if(!paid) return NextResponse.json({ error: 'Payment required' }, { status: 403 })

    const filePath = `rentals/${email}_${filmId}.json`
    const now = Date.now()

    // 3. Check if rental already exists and is valid
    const get = await fetch(`${GITHUB_API}/repos/${REPO}/contents/${filePath}`, { headers: ghHeaders, cache: 'no-store' })
    if(get.ok) {
      const { content } = await get.json()
      const data = JSON.parse(Buffer.from(content, 'base64').toString())
      if(data.expires > now) { 
        return NextResponse.json({ exp: Math.floor(data.expires/1000) }) // <- Only return exp, not url
      }
    }

    // 4. Create new 7 day rental
    const expires = now + 7 * 24 * 60 * 60 * 1000
    const newFile = { email, filmId, expires, created_at: now }
    
    await fetch(`${GITHUB_API}/repos/${REPO}/contents/${filePath}`, {
      method: 'PUT',
      headers: { ...ghHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `Rent: ${filmId}`, content: Buffer.from(JSON.stringify(newFile)).toString('base64') })
    })

    return NextResponse.json({ exp: Math.floor(expires/1000) }) // <- Only exp

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
