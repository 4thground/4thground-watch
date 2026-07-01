'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const params = useSearchParams();

  useEffect(() => {
    const filmId = params.get('filmId');
    if (window.opener && filmId) {
      window.opener.postMessage({ status: 'payment_success', filmId }, '*');
      window.close(); // Kill popup
    }
  }, [params]);

  return <div className="bg-black text-white min-h-screen flex items-center justify-center">Payment successful. Closing window...</div>;
}
