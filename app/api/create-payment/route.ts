export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, filmId, amount, returnUrl } = await req.json();

    if (!email || !filmId || !amount) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      );
    }

    const API_KEY = process.env.IKHOKHA_API_KEY;
    const API_SECRET = process.env.IKHOKHA_API_SECRET;

    if (!API_KEY || !API_SECRET) {
      return NextResponse.json(
        { error: 'Missing API credentials' },
        { status: 500 }
      );
    }

    // -----------------------------
    // STEP 1: PAYLOAD
    // -----------------------------
    const payload = {
      amount: Number(amount),
      currency: 'ZAR',
      reference: `${filmId}-${Date.now()}`,
      returnUrl,
      customer: { email }
    };

    // -----------------------------
    // STEP 2: SIGNATURE (HMAC STYLE)
    // -----------------------------
    const signatureBase = JSON.stringify(payload) + API_SECRET;

    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      encoder.encode(signatureBase)
    );

    const signature = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // -----------------------------
    // STEP 3: CALL IKHOKHA
    // -----------------------------
    const res = await fetch('https://api.ikhokha.com/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        'X-Signature': signature
      },
      body: JSON.stringify(payload)
    });

    const resData = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: resData },
        { status: 400 }
      );
    }

    // -----------------------------
    // STEP 4: PAYMENT URL
    // -----------------------------
    const paymentUrl =
      resData?.paymentUrl ||
      resData?.redirectUrl ||
      resData?.url;

    if (!paymentUrl) {
      return NextResponse.json(
        { error: 'No payment URL returned from iKhokha' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      paymentUrl,
      reference: payload.reference
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
