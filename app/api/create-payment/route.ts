export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "crypto";

const API_URL = "https://api.ikhokha.com/public-api/v1/api/payment";
const API_PATH = "/public-api/v1/api/payment";

function escapePayload(str: string) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\u0000/g, "\\0");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Incoming body:", body);

    const { email, filmId, amount } = body;

    if (!email || !filmId || amount === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields.",
        },
        { status: 400 }
      );
    }

    const APP_ID = process.env.IKHOKHA_API_KEY;
    const APP_SECRET = process.env.IKHOKHA_API_SECRET;

    if (!APP_ID || !APP_SECRET) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing iKhokha environment variables.",
        },
        { status: 500 }
      );
    }

    const origin = new URL(req.url).origin;

    const RATE = Number(process.env.USD_TO_ZAR_RATE || "18.5");

    const amountInCents = Math.round(Number(amount) * RATE * 100);

    const externalTransactionID = crypto.randomUUID();

    const payload = {
      entityID: APP_ID,
      externalEntityID: filmId,
      amount: amountInCents,
      currency: "ZAR",
      requesterUrl: origin,
      description: `Rental ${filmId}`,
      paymentReference: externalTransactionID,
      mode: "live",
      externalTransactionID,

      urls: {
        callbackUrl: `${origin}/api/ikhokha/webhook`,
        successPageUrl: `${origin}/payment/success`,
        failurePageUrl: `${origin}/payment/failed`,
        cancelUrl: `${origin}/film/${filmId}`,
      },
    };

    console.log("Payload:");
    console.log(payload);

    const requestBody = JSON.stringify(payload);

    const payloadToSign = escapePayload(API_PATH + requestBody);

    const signature = crypto
      .createHmac("sha256", APP_SECRET.trim())
      .update(payloadToSign)
      .digest("hex");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "IK-APPID": APP_ID.trim(),
        "IK-SIGN": signature,
      },
      body: requestBody,
    });

    const raw = await response.text();

    console.log("iKhokha Status:", response.status);
    console.log("iKhokha Response:", raw);

    let json;

    try {
      json = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: raw,
        },
        { status: response.status }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          ikhokha: json,
        },
        { status: response.status }
      );
    }

    if (json.responseCode !== "00") {
      return NextResponse.json(
        {
          success: false,
          ikhokha: json,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentUrl: json.paylinkUrl,
      paylinkID: json.paylinkID,
      externalTransactionID,
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
