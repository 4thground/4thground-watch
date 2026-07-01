export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { filmId, email, amount_usd } = await req.json();

    if (!filmId || !email || !amount_usd) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      );
    }

    const RATE = Number(process.env.USD_TO_ZAR_RATE || 18.5);

    const ZAR_CENTS = Math.round(Number(amount_usd) * RATE * 100);

    // 🔐 USE BOTH KEY + SECRET (correct structure)
    const API_KEY = process.env.IKHOKHA_API_KEY;
    const API_SECRET = process.env.IKHOKHA_API_SECRET;

    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

    const r = await fetch('https://api.ikhokha.com/pay/v1/tokens', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: ZAR_CENTS,
        currency: 'ZAR',
        reference: `4g_${filmId}_${Date.now()}`,
        customer: { email },
      }),
    });

    const resultText = await r.text();

    if (!r.ok) {
      return NextResponse.json(
        { error: `iKhokha: ${resultText}` },
        { status: 500 }
      );
    }

    const result = JSON.parse(resultText);

    return NextResponse.json({
      token: result.token,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );
  }
}
