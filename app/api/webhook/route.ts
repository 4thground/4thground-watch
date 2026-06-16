import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')!
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const supabase = createClient()
    await supabase.from('rentals').insert({
      film_id: session.metadata.film_id,
      stripe_session_id: session.id,
      type: session.metadata.type,
      expires_at: session.metadata.type === 'rent' 
        ? new Date(Date.now() + 48 * 60 * 60 * 1000) 
        : null
    })
  }
  return NextResponse.json({ received: true })
}
