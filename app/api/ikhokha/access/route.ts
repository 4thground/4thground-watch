import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET(req: Request) {
  const session = new URL(req.url).searchParams.get('session')
  if (!session) return NextResponse.json({ status: 'pending' })
  
  // 1. Check if we already marked it paid
  const access = await kv.get(`access:${session}`) 
  if (access) return NextResponse.json({ status: 'paid', expires: JSON.parse(access).expires })
  
  // 2. If not, ask iKhokha directly: "Is this session paid?"
  const r = await fetch(`https://dashboard.ikhokha.com/payment/api/checkout/${session}`, {
    headers: { 
      'Authorization': `Bearer ${process.env.IKHOKHA_API_KEY}`,
      'X-Secret-Key': process.env.IKHOKHA_SECRET!
    }
  })
  
  if (!r.ok) return NextResponse.json({ status: 'pending' })
  const data = await r.json()
  
  if (data.status === 'paid' || data.status === 'completed') {
    const pending = await kv.get(`rent:${session}`)
    if (pending) {
      const { filmId } = JSON.parse(pending)
      const expires = Date.now() + 7 * 24 * 60 * 60 * 1000
      await kv.set(`access:${session}`, JSON.stringify({ filmId, expires }), { ex: 7 * 24 * 60 * 60 })
      await kv.del(`rent:${session}`)
      return NextResponse.json({ status: 'paid', expires })
    }
  }
  
  return NextResponse.json({ status: data.status || 'pending' })
}
