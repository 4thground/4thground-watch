import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const { email, filmId, price } = body;

  if (!email || !filmId) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  // TODO: replace with real iKhokha API call
  const paymentLink = `https://pay.ikhokha.com/checkout?ref=${filmId}`;

  return NextResponse.json({
    url: paymentLink,
  });
}
