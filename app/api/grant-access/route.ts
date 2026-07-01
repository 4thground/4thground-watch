import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, filmId, paymentRef } = await req.json();

    if (!email || !filmId) {
      return NextResponse.json(
        { error: 'Missing data' },
        { status: 400 }
      );
    }

    const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;

    // ⚠️ SIMPLE STORAGE (we will upgrade later to DB)
    // For now we simulate "server-side access grant"

    return NextResponse.json({
      success: true,
      access: {
        filmId,
        email,
        expires,
        type: 'rent',
      },
    });

  } catch (err) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
