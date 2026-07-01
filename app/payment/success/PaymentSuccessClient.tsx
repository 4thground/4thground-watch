'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const paylinkId = searchParams.get('paylinkId');

  const [status, setStatus] =
    useState<'checking' | 'paid' | 'failed'>('checking');

  useEffect(() => {
    if (!paylinkId) {
      setStatus('failed');
      return;
    }

    const checkPayment = async () => {
      try {
        const res = await fetch(
          `/api/ikhokha/status?paylinkId=${paylinkId}`
        );

        const data = await res.json();

        if (data.status === 'PAID') {
          localStorage.setItem(
            `4g_access_${data.filmId || 'film'}`,
            JSON.stringify({
              type: 'rent',
              paidAt: Date.now(),
            })
          );

          setStatus('paid');
        } else {
          setTimeout(checkPayment, 3000);
        }
      } catch {
        setStatus('failed');
      }
    };

    checkPayment();
  }, [paylinkId]);

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Confirming payment...</p>
      </div>
    );
  }

  if (status === 'paid') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">
          Payment Successful 🎬
        </h1>
        <p className="text-zinc-400 mb-6">
          You now have 7 days access.
        </p>

        <Link
          href="/"
          className="bg-white text-black px-6 py-3 rounded-full font-semibold"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p>Payment verification failed.</p>
    </div>
  );
}
