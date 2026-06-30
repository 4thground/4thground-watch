import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { filmId, email, amount_usd } = await req.json()
    if(!filmId || !email || !amount_usd) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const RATE = Number(process.env.USD_TO_ZAR_RATE!) // e.g. 18.50
    const ZAR_CENTS = Math.round(Number(amount_usd) * RATE * 100) // $3.99 -> R73.81 -> 7381

    const r = await fetch('https://api.ikhokha.com/pay/v1/tokens', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${process.env.IKHOKHA_API_KEY}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        amount: ZAR_CENTS, // iKhokha only takes ZAR
        currency: 'ZAR', 
        reference: `4g_${email}_${filmId}_${Date.now()}`, // Unique
        customer: { email }
      })
    })

    if(!r.ok) {
      const e = await r.text()
      return NextResponse.json({ error: `iKhokha: ${e}` }, { status: 500 })
    }

    const { token } = await r.json() // This token goes to `ikPay.init()`
    return NextResponse.json({ token })

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
