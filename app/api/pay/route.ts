import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, filmId, price } = await req.json();

  if (!email || !filmId) {
    return NextResponse.json(
      { error: 'Missing email or filmId' },
      { status: 400 }
    );
  }

  try {
    // 👉 iKhokha API request (PLACEHOLDER STRUCTURE)
    const response = await fetch('https://api.ikhokha.com/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.IKHOKHA_API_KEY}`,
      },
      body: JSON.stringify({
        amount: price,
        currency: 'ZAR',
        reference: filmId,
        customerEmail: email,

        // VERY IMPORTANT: redirect after payment
        successUrl: `https://yourdomain.com/success?film=${filmId}&email=${email}`,
        cancelUrl: `https://yourdomain.com/film/${filmId}`,
      }),
    });

    const data = await response.json();

    // iKhokha usually returns a checkout URL
    const checkoutUrl = data?.redirectUrl || data?.url;

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'No checkout URL returned' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    return NextResponse.json(
      { error: 'Payment request failed' },
      { status: 500 }
    );
  }
}
