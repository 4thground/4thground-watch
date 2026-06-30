import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function POST(req: Request) {
  const body = await req.json()
  // iKhokha sends: { reference: session_id, status: 'completed', amount: 399 }
  
  if (body.status === 'completed') {
    const session_id = body.reference
    const pending = await kv.get(`rent:${session_id}`)
    if (pending) {
      const { filmId } = JSON.parse(pending)
      const expires = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
      // Key by filmId so we can check access fast
      await kv.set(`access:${filmId}`, JSON.stringify({ expires }), { ex: 7 * 24 * 60 * 60 })
      await kv.del(`rent:${session_id}`) // cleanup
    }
  }
  return NextResponse.json({ ok: true }) // Must return 200
}
