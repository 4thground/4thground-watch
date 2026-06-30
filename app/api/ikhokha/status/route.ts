import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET(req: Request) {
  const session = new URL(req.url).searchParams.get('session')
  if (!session) return NextResponse.json({ status: 'pending' })
  
  const pending = await kv.get(`rent:${session}`)
  if (!pending) return NextResponse.json({ status: 'not_found' })
  
  const { filmId } = JSON.parse(pending)
  const access = await kv.get(`access:${filmId}`)
  
  if (access) {
    const { expires } = JSON.parse(access)
    return NextResponse.json({ status: 'paid', expires })
  }
  return NextResponse.json({ status: 'pending' })
}
