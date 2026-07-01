export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import crypto from 'crypto';

const API_PATH = '/api/ikhokha/webhook';

function escapePayload(str: string) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\u0000/g, '\\0');
}

/**
 * VERIFY IKHO KHA SIGNATURE
 */
function verifySignature(rawBody: string, incomingSignature: string) {
  const APP_SECRET = process.env.IKHOKHA_API_SECRET;

  if (!APP_SECRET) return false;

  const payloadToSign = escapePayload(API_PATH + rawBody);

  const expectedSignature = crypto
    .createHmac('sha256', APP_SECRET.trim())
    .update(payloadToSign)
    .digest('hex');

  return expectedSignature === incomingSignature;
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();

    const signature =
      req.headers.get('ik-sign') ||
      req.headers.get('IK-SIGN');

    const appId =
      req.headers.get('ik-appid') ||
      req.headers.get('IK-APPID');

    // 1. Validate headers
    if (!signature || !appId) {
      return NextResponse.json(
        { error: 'Missing headers' },
        { status: 400 }
      );
    }

    // 2. Verify signature
    const isValid = verifySignature(rawBody, signature);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // 3. Parse webhook body
    const data = JSON.parse(rawBody);

    const {
      status,
      externalTransactionID,
      paylinkID
    } = data;

    // 4. Only handle successful payments
    if (status !== 'SUCCESS') {
      return NextResponse.json({
        message: 'Payment not successful'
      });
    }

    // 5. Extract film + email from reference
    // reference format: filmId-email-timestamp (we created earlier)
    const parts = externalTransactionID.split('-');

    const filmId = parts[0];

    // NOTE: email is NOT secure storage here in MVP mode
    // so we skip server-side email mapping in Option A

    const paidAt = Date.now();
    const expires = paidAt + 7 * 24 * 60 * 60 * 1000;

    /**
     * OPTION A STORAGE STRATEGY:
     * We return info to frontend polling system OR
     * rely on success redirect to set localStorage
     */

    return NextResponse.json({
      success: true,
      filmId,
      expires,
      paylinkID
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
