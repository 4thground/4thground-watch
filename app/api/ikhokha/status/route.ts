export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

const BASE = 'https://api.ikhokha.com/public-api/v1/api/getStatus';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const paylinkId = searchParams.get('paylinkId');

    if (!paylinkId) {
      return NextResponse.json(
        { error: 'Missing paylinkId' },
        { status: 400 }
      );
    }

    const APP_ID = process.env.IKHOKHA_API_KEY;

    const res = await fetch(`${BASE}/${paylinkId}`, {
      headers: {
        'IK-APPID': APP_ID!,
      },
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
