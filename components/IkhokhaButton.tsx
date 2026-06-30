'use client'

import { useState } from 'react'

interface IkhokhaButtonProps {
  filmId: string
  filmSlug: string
  bunnyStreamId: string // You said film is in Bunny
  price?: string // "3.99"
  userEmail?: string | null
}

export default function IkhokhaButton({ filmId, filmSlug, bunnyStreamId, price = "3.99", userEmail }: IkhokhaButtonProps) {
  const [open, setOpen] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState('')

  const handleClick = async () => {
    const res = await fetch('/api/ikhokha/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        filmId, 
        filmSlug, 
        bunnyStreamId,
        amount: 3.99, 
        email: userEmail 
      })
    })
    const { checkout_url } = await res.json()
    setCheckoutUrl(checkout_url)
    setOpen(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="bg-white hover:bg-zinc-200 text-black font-bold py-3 px-8 rounded-lg text-lg w-full md:w-auto transition"
      >
        Rent $3.99 - 7 Day Access
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 grid place-items-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-zinc-900 rounded-2xl w-full max-w-lg h-[700px] border-white/10 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="font-semibold">Complete Rental</h3>
              <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <iframe 
              src={checkoutUrl} 
              className="w-full h-[calc(100%-60px)]" 
              allow="payment"
            />
          </div>
        </div>
      )}
    </>
  )
}
