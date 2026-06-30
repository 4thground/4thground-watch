import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET(req: Request) {
  const filmId = new URL(req.url).searchParams.get('filmId')
  if (!filmId) return NextResponse.json({ expires: 0 })
  
  const access = await kv.get(`access:${filmId}`)
  return NextResponse.json(access || { expires: 0 })
}
