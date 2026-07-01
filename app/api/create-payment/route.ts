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
    const { email, filmId, amount } = await req.json();

    if (!email || !filmId || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const APP_ID = process.env.IKHOKHA_API_KEY;
    const APP_SECRET = process.env.IKHOKHA_API_SECRET;

    if (!APP_ID || !APP_SECRET) {
      return NextResponse.json(
        { error: 'Missing iKhokha credentials.' },
        { status: 500 }
      );
    }

    // Current site (works on Preview & Production)
    const origin = new URL(req.url).origin;

    // USD -> ZAR
    const RATE = Number(process.env.USD_TO_ZAR_RATE || '18.50');

    const amountInCents = Math.round(
      Number(amount) * RATE * 100
    );

    const externalTransactionID =
      `${filmId}-${crypto.randomUUID()}`;

    const payload = {
      entityID: APP_ID,
      externalEntityID: filmId,
      amount: amountInCents,
      currency: 'ZAR',
      requesterUrl: origin,
      description: `Rental - ${filmId}`,
      paymentReference: externalTransactionID,
      mode: 'live',
      externalTransactionID,

      urls: {
        callbackUrl: `${origin}/api/ikhokha/webhook`,
        successPageUrl: `${origin}/payment/success`,
        failurePageUrl: `${origin}/payment/failed`,
        cancelUrl: `${origin}/film/${filmId}`,
      },
    };

    const requestBody = JSON.stringify(payload);

    const payloadToSign = escapePayload(
      API_PATH + requestBody
    );

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
        'IK-SIGN': signature,
      },
      body: requestBody,
    });

    const text = await response.text();

    let result: any;

    try {
      result = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          error: text,
        },
        {
          status: response.status,
        }
      );
    }

    if (!response.ok) {
      return NextResponse.json(result, {
        status: response.status,
      });
    }

    if (
      result.responseCode !== '00' ||
      !result.paylinkUrl
    ) {
      return NextResponse.json(
        {
          error:
            result.message ||
            'Unable to create payment link.',
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      paymentUrl: result.paylinkUrl,
      paylinkID: result.paylinkID,
      externalTransactionID,
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}
