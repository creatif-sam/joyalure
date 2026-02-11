"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

function Countdown({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState("00:00:00")

  useEffect(() => {
    const target = new Date(endDate).getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const diff = target - now

      if (diff <= 0) {
        setTimeLeft("00:00:00")
        clearInterval(timer)
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  return (
    <span className="mt-2 inline-block px-4 py-1 text-xs tracking-widest text-white bg-white/20 backdrop-blur rounded-full border border-white/10">
      Ends in {timeLeft}
    </span>
  )
}

export default function SpecialOffers() {
  return (
    <section className="bg-white dark:bg-zinc-950 py-24 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 20 percent offer */}
        <div className="relative h-[360px] rounded-2xl overflow-hidden group border dark:border-zinc-800">
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
            alt="Save 20 percent"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
              SAVE 20%
            </span>

            <Countdown endDate="2026-01-31T23:59:59" />

            <h3 className="text-white text-3xl font-black tracking-tighter uppercase italic mt-6 mb-6">
              Special Offer
            </h3>

            <Link
              href="/products?offer=20"
              className="inline-block bg-yellow-400 text-black px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all active:scale-95 shadow-lg shadow-yellow-400/20 hover:shadow-green-600/20"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* 30 percent offer */}
        <div className="relative h-[360px] rounded-2xl overflow-hidden group border dark:border-zinc-800">
          <img
            src="https://images.unsplash.com/photo-1519744792095-2f2205e87b6f"
            alt="Save 30 percent"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/45 group-hover:bg-black/55 transition-colors" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
              SAVE 30%
            </span>

            <Countdown endDate="2026-01-25T23:59:59" />

            <h3 className="text-white text-3xl font-black tracking-tighter uppercase italic mt-6 mb-6">
              Special Offer
            </h3>

            <Link
              href="/products?offer=30"
              className="inline-block bg-yellow-400 text-black px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all active:scale-95 shadow-lg shadow-yellow-400/20 hover:shadow-green-600/20"
            >
              Shop Now
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}