import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { v4 as uuid } from 'uuid'

export async function POST(req: Request) {
  const { filmId, amount } = await req.json()
  const session_id = uuid()
  
  // Save pending for 15min. Key = session_id
  await kv.set(`rent:${session_id}`, JSON.stringify({ filmId, status: 'pending' }), { ex: 900 })

  const payload = {
    amount: 399, // $3.99 = 399 cents
    currency: 'USD', 
    payment_methods: ['card'],
    description: `4TH GROUND: Rent ${filmId}`,
    reference: session_id, // This is how we match webhook -> film
    success_url: 'https://4thground.com', // Not used, we poll
    cancel_url: 'https://4thground.com'
  }

  const r = await fetch('https://dashboard.ikhokha.com/payment/api/checkout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.IKHOKHA_API_KEY}`,
      'X-Secret-Key': process.env.IKHOKHA_SECRET!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  
  if (!r.ok) return NextResponse.json({ error: 'iKhokha failed' }, { status: 500 })
  const data = await r.json()
  return NextResponse.json({ checkout_url: data.url, session_id })
}
