export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import crypto from 'crypto';

const API_URL = 'https://api.ikhokha.com/public-api/v1/api/payment';
const API_PATH = '/public-api/v1/api/payment';

function escapePayload(str: string) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\u0000/g, '\\0');
}

export async function POST(req: Request) {
  try {
    const { email, filmId, amount, returnUrl } = await req.json();

    if (!email || !filmId || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const APP_ID = process.env.IKHOKHA_API_KEY;
    const APP_SECRET = process.env.IKHOKHA_API_SECRET;
    const SITE = process.env.NEXT_PUBLIC_SITE_URL;

    if (!APP_ID || !APP_SECRET || !SITE) {
      return NextResponse.json(
        { error: 'Missing server environment variables.' },
        { status: 500 }
      );
    }

    // Convert USD -> ZAR cents
    // Set USD_TO_ZAR_RATE in Vercel (example: 18.50)
    const RATE = Number(process.env.USD_TO_ZAR_RATE || 18.5);

    const amountInCents = Math.round(Number(amount) * RATE * 100);

    const externalTransactionID =
      `${filmId}-${Date.now()}`;

    const payload = {
      entityID: APP_ID,
      externalEntityID: filmId,
      amount: amountInCents,
      currency: 'ZAR',
      requesterUrl: SITE,
      description: `Rental - ${filmId}`,
      paymentReference: externalTransactionID,
      mode: 'live',
      externalTransactionID,

      urls: {
        callbackUrl: `${SITE}/api/ikhokha/webhook`,
        successPageUrl: `${SITE}/payment/success`,
        failurePageUrl: `${SITE}/payment/failed`,
        cancelUrl: `${SITE}/film/${filmId}`
      }
    };

    const requestBody = JSON.stringify(payload);

    const payloadToSign =
      escapePayload(API_PATH + requestBody);

    const signature = crypto
      .createHmac('sha256', APP_SECRET.trim())
      .update(payloadToSign)
      .digest('hex');

    const response = await fetch(API_URL, {
      method: 'POST',

      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',

        'IK-APPID': APP_ID.trim(),
        'IK-SIGN': signature
      },

      body: requestBody
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        result,
        { status: response.status }
      );
    }

    if (
      result.responseCode !== '00' ||
      !result.paylinkUrl
    ) {
      return NextResponse.json(
        {
          error:
            result.message ??
            'Unable to create payment link.'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      paymentUrl: result.paylinkUrl,
      paylinkID: result.paylinkID,
      externalTransactionID
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message
      },
      {
        status: 500
      }
    );
  }
}
