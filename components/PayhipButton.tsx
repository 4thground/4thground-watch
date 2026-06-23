'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PayhipButtonProps {
  type: 'rent' | 'buy'
  filmId: string
  filmSlug: string
  price: string // "3.99" or "9.99"
  userEmail?: string | null
}

const PAYHIP_IDS = {
  rent: '3fYqG', // $3.99 - 7 Day Access
  buy: '8kqEm' // $9.99 - Own Forever
}

export default function PayhipButton({ type, filmId, filmSlug, price, userEmail }: PayhipButtonProps) {
  const router = useRouter()
  const productId = PAYHIP_IDS[type]

  useEffect(() => {
    // Load Payhip.js once
    if (!document.querySelector('script[src="https://payhip.com/payhip.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://payhip.com/payhip.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    // If you have login, check here. If not, Payhip will collect email.
    // We pass filmId + type to Payhip via passthrough
    // Your webhook will use this to grant access
  }

  const label = type === 'rent'
 ? `Rent $${price} - 7 Day Access`
    : `Buy $${price}`

  return (
    <a
      href={`https://payhip.com/b/${productId}`}
      className="payhip-buy-button bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg inline-block text-center w-full md:w-auto"
      data-product={productId}
      data-theme="none"
      data-email={userEmail || ''}
      data-passthrough={JSON.stringify({ filmId, filmSlug, type })}
      onClick={handleClick}
    >
      {label}
    </a>
  )
}
