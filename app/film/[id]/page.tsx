'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import films from '@/data/films.json';

type AccessState = {
  type: string;
  expires: number;
  progress: number;
};

// Payhip product IDs
const PAYHIP_PRODUCTS = {
  rent: '3fYqG', // $3.99 USD - 7 Day Access
  buy: '8kqEm'  // $9.99 USD - Own Forever
};

const PRICES = {
  rent: '3.99',
  buy: '9.99'
};

export default function FilmPage({ params }: { params: { id: string } }) {
  const film = (films as any[]).find((f) => f.id === params.id);

  const [email, setEmail] = useState('');
  const [access, setAccess] = useState<AccessState | null>(null);
  const [showTrailerEnd, setShowTrailerEnd] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!film) return;

    // Load Payhip.js
    if (!document.querySelector('script[src="https://payhip.com/payhip.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://payhip.com/payhip.js';
      script.async = true;
      script.onerror = () => console.error('Payhip.js failed to load - likely blocked by ad blocker');
      document.body.appendChild(script);
    }

    const savedEmail = localStorage.getItem('4g_email');

    if (savedEmail) {
      setEmail(savedEmail);

      const key = `4g_access_${film.id}_${savedEmail}`;
      const saved = localStorage.getItem(key);

      if (saved) {
        const { type, paidAt } = JSON.parse(saved);
        const expires =
          type === 'buy' ? Infinity : paidAt + 7 * 24 * 60 * 60 * 1000; // 7 DAYS

        const progress = Number(
          localStorage.getItem(`4g_progress_${film.id}_${savedEmail}`) || 0
        );

        if (expires > Date.now()) {
          setAccess({ type, expires, progress });
        } else {
          localStorage.removeItem(key);
        }
      }
    }

    // Listen for Payhip success
    const handlePayhipSuccess = (e: any) => {
      const { product_id } = e.detail;
      const currentEmail = localStorage.getItem('4g_email') || email;
      
      if (!currentEmail) {
        alert('Please enter email before purchase');
        return;
      }
      
      let type = '';
      if (product_id === PAYHIP_PRODUCTS.rent) type = 'rent';
      if (product_id === PAYHIP_PRODUCTS.buy) type = 'buy';
      if (!type) return;

      const key = `4g_access_${film.id}_${currentEmail}`;
      localStorage.setItem(
        key,
        JSON.stringify({
          type,
          paidAt: Date.now(),
        })
      );
      localStorage.setItem('4g_email', currentEmail);

      setTimeout(() => window.location.reload(), 500);
    };

    window.addEventListener('payhip:success', handlePayhipSuccess);
    return () => window.removeEventListener('payhip:success', handlePayhipSuccess);
  }, [film, email]);

  useEffect(() => {
    const handleFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreen);
    };
  }, []);

  useEffect(() => {
    if (!film) return;

    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://iframe.mediadelivery.net') return;

      const { event, currentTime } = e.data;

      if (event === 'timeupdate' && access && email) {
        localStorage.setItem(
          `4g_progress_${film.id}_${email}`,
          Math.floor(currentTime).toString()
        );
      }

      if (event === 'ended' && !access) {
        setShowTrailerEnd(true);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [access, film, email]);

  if (!film) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Film not found.
      </div>
    );
  }

  const handleBuyClick = (e: React.MouseEvent, type: 'rent' | 'buy') => {
    e.preventDefault(); // NO REDIRECT EVER
    
    if (!email) {
      alert('Enter email first');
      return;
    }

    localStorage.setItem('4g_email', email);

    // Check if Payhip loaded - show error instead of redirect
    if (!(window as any).Payhip?.Checkout) {
      alert('Payment system blocked. Please disable ad blocker and refresh the page, then try again.');
      console.error('Payhip.js not loaded. Check Network tab - payhip.js likely blocked');
      return;
    }

    // Manually open Payhip modal
