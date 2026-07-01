import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, filmId, amount } = await req.json();

    if (!email || !filmId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 🔐 IKHOKHA CREDENTIALS (store in .env later)
    const API_KEY = process.env.IKHOKHA_API_KEY!;
    const API_SECRET = process.env.IKHOKHA_API_SECRET!;

    // 🧠 CREATE PAYMENT REQUEST
    const response = await fetch('https://api.ikhokha.com/public-api/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        amount: Math.round(Number(amount) * 100), // cents
        currency: 'ZAR',
        reference: `${filmId}-${Date.now()}`,
        customer: {
          email,
        },
        returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/film/${filmId}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('iKhokha error:', data);
      return NextResponse.json(
        { error: 'Payment creation failed' },
        { status: 500 }
      );
    }

    // ⚡ THIS IS WHAT FRONTEND NEEDS
    const paymentUrl =
      data?.checkoutUrl ||
      data?.redirectUrl ||
      data?.url;

    if (!paymentUrl) {
      return NextResponse.json(
        { error: 'No payment URL returned from iKhokha' },
        { status: 500 }
      );
    }

    return NextResponse.json({ paymentUrl });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
