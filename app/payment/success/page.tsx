import { Suspense } from 'react';
import PaymentSuccessClient from './PaymentSuccessClient';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          Loading...
        </div>
      }
    >
      <PaymentSuccessClient />
    </Suspense>
  );
}
