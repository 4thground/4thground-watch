import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { filmId, filmSlug, bunnyStreamId, amount, email } = await req.json()
  
  const payload = {
    amount: 399, // $3.99 = 399 cents. iKhokha uses ZAR/SZL but accepts USD display
    currency: 'USD', // iKhokha supports USD for international cards
    payment_methods: ['card'], // EFT is ZAR only, so kill it for USD
    customer_email: email || '',
    description: `4TH GROUND: Rent - ${filmSlug}`,
    reference: `4TG-${filmId}-${bunnyStreamId}-${Date.now()}`,
    success_url: `https://4thground.com/api/ikhokha/success?film=${filmSlug}`, // We’ll poll this
    cancel_url: `https://4thground.com/film/${filmSlug}`
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
  
  const data = await r.json()
  return NextResponse.json({ checkout_url: data.url })
}
