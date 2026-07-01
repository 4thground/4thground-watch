'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const params = useSearchParams();

  useEffect(() => {
    const filmId = params.get('filmId');
    console.log('iKhokha Success. Film:', filmId); // Check Vercel logs if stuck

    if (window.opener && filmId) {
      // 1. Tell parent window we are paid
      window.opener.postMessage({ status: 'payment_success', filmId }, '*');
      // 2. Close self immediately
      window.close();
    } else {
      // Fallback if popup was blocked
      window.location.href = `/film/${filmId}?status=success&filmId=${filmId}`;
    }
  }, [params]);

  return <div className="bg-black text-white min-h-screen flex items-center justify-center text-xl">Payment Successful... Closing</div>;
}
