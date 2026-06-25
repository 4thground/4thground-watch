'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script'; // CHANGE 1: Added this import
import films from '@/data/films.json';

type AccessState = {
  type: string;
  expires: number;
  progress: number;
};

const PAYHIP_PRODUCTS = {
  rent: '3YqxG', // CHANGE 2: Updated from '3fYq1' to match your embed code
  buy: '8kqE2'
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
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!film) return;

    const savedEmail = localStorage.getItem('4g_email');
    if (savedEmail) {
      setEmail(savedEmail);
      const key = `4g_access_${film.id}_${savedEmail}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const { type, paidAt } = JSON.parse(saved);
        const expires = type === 'buy'? Infinity : paidAt + 7 * 24 * 60 * 60 * 1000;
        const progress = Number(localStorage.getItem(`4g_progress_${film.id}_${savedEmail}`) || 0);
        if (expires > Date.now()) {
          setAccess({ type, expires, progress });
        } else {
          localStorage.removeItem(key);
        }
      }
    }

    // Check Payhip return
    const urlParams = new URLSearchParams(window.location.search);
    const payhipSuccess = urlParams.get('payhip_success');
    const payhipProduct = urlParams.get('product');
    
    if (payhipSuccess === 'true' && payhipProduct) {
      const currentEmail = localStorage.getItem('4g_email') || email;
      let type = '';
      if (payhipProduct === PAYHIP_PRODUCTS.rent) type = 'rent';
      if (payhipProduct === PAYHIP_PRODUCTS.buy) type = 'buy';
      
      if (type && currentEmail) {
        const key = `4g_access_${film.id}_${currentEmail}`;
        localStorage.setItem(key, JSON.stringify({ type, paidAt: Date.now() }));
        window.history.replaceState({}, '', `/film/${film.id}`);
        setTimeout(() => window.location.reload(), 100);
      }
    }

    const handleMessage = (e: MessageEvent) => {
      if (e.origin!== 'https://iframe.mediadelivery.net') return;
      const { event, currentTime } = e.data;
      if (event === 'timeupdate' && access && email) {
        localStorage.setItem(`4g_progress_${film.id}_${email}`, Math.floor(currentTime).toString());
      }
      if (event === 'ended' &&!access) {
        setShowTrailerEnd(true);
        setIsPlaying(false);
      }
      if (event === 'pause') {
        setIsPlaying(false);
      }
      if (event === 'play') {
        setIsPlaying(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [film, email, access]);

  useEffect(() => {
    const handleFullscreen = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreen);
    return () => document.removeEventListener('fullscreenchange', handleFullscreen);
  }, []);

  if (!film) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Film not found.</div>;
  }

  const handleBuyClick = (e: React.MouseEvent, type: 'rent' | 'buy') => {
    e.preventDefault();
    if (!email) {
      alert("Enter email first");
      return;
    }
    localStorage.setItem('4g_email', email);
    
    const productId = type === 'rent' ? PAYHIP_PRODUCTS.rent : PAYHIP_PRODUCTS.buy;
    const returnUrl = `${window.location.origin}/film/${film.id}?payhip_success=true&product=${productId}`;
    const checkoutUrl = `https://payhip.com/b/${productId}?email=${encodeURIComponent(email)}&redirect_url=${encodeURIComponent(returnUrl)}`;
    
    window.open(checkoutUrl, '_blank', 'width=600,height=800');
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
    setShowTrailerEnd(false);
  };

  const videoId = access? film.bunny_video_id : film.bunny_trailer_id;
  const startTime = access?.progress || 0;
  const otherFilms = (films as any[]).filter((f) => f.id!== film.id);

  return (
    <>
      {/* CHANGE 3: Add Payhip script - paste this at the very top of your return */}
      <Script src="https://payhip.com/payhip.js" strategy="beforeInteractive" />
      
      {/* <a 
  href="https://payhip.com/b/3YqxG" 
  className="payhip-buy-button" 
  data-theme="grey" 
  data-product="3YqxG"
  data-email={email}
>
  Rent ${PRICES.rent}
</a>

<button onClick={(e) => handleBuyClick(e, 'buy')}>
  Buy ${PRICES.buy}
</button> */}
      {/* Example: Find where your buttons are and use this for RENT: */}
      
      {/* RENT BUTTON - Replace your old rent button with this */}
      <a 
        href="https://payhip.com/b/3YqxG" 
        className="payhip-buy-button" 
        data-theme="grey" 
        data-product="3YqxG"
        data-email={email}
      >
        Rent Now
      </a>

      {/* BUY BUTTON - Keep your existing button exactly as is */}
      <button onClick={(e) => handleBuyClick(e, 'buy')}>
        Buy ${PRICES.buy}
      </button>
    </>
  );
}
