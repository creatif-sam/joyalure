"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

type SpecialOffer = {
  id: string
  title: string
  description: string | null
  discount_percentage: number
  image_url: string | null
  link_url: string | null
  end_date: string | null
  is_active: boolean
  display_order: number
}

function Countdown({ endDate }: { endDate: string | null }) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null)

  useEffect(() => {
    if (!endDate) return

    const target = new Date(endDate).getTime()
    if (target <= Date.now()) return

    const compute = () => {
      const diff = target - Date.now()
      if (diff <= 0) {
        setTimeLeft(null)
        return false
      }
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1_000)
      setTimeLeft(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`)
      return true
    }

    if (!compute()) return
    const timer = setInterval(() => { if (!compute()) clearInterval(timer) }, 1000)
    return () => clearInterval(timer)
  }, [endDate])

  if (!timeLeft) return null

  return (
    <span className="mt-2 inline-block px-4 py-1 text-xs tracking-widest text-white bg-white/20 backdrop-blur rounded-full border border-white/10">
      Ends in {timeLeft}
    </span>
  )
}

export default function SpecialOffers() {
  const [offers, setOffers] = useState<SpecialOffer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOffers() {
      try {
        const response = await fetch("/api/special-offers")
        const data = await response.json()
        setOffers(data.offers || [])
      } catch (error) {
        console.error("Failed to fetch special offers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

  if (loading) {
    return (
      <section className="bg-white dark:bg-zinc-950 py-24 px-4 transition-colors duration-500">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 dark:text-zinc-400">Loading offers...</p>
        </div>
      </section>
    )
  }

  if (offers.length === 0) {
    return null // Don't show section if no offers
  }

  return (
    <section className="bg-white dark:bg-zinc-950 py-24 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="relative h-[360px] rounded-2xl overflow-hidden group border dark:border-zinc-800"
          >
            <Image
              src={offer.image_url || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"}
              alt={offer.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
              <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
                SAVE {offer.discount_percentage}%
              </span>
              <Countdown endDate={offer.end_date} />
              <h3 className="text-white text-3xl font-black tracking-tighter uppercase mt-6 mb-6">
                {offer.title}
              </h3>
              {offer.description && (
                <p className="text-white/80 text-sm mb-6 max-w-md">
                  {offer.description}
                </p>
              )}
              <Link
                href={offer.link_url || `/products?offer=${offer.discount_percentage}`}
                className="inline-block bg-yellow-400 text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-md hover:bg-green-600 hover:text-white transition-all active:scale-95 shadow-lg shadow-yellow-400/20 hover:shadow-green-600/20"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
