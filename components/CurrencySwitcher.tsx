"use client"

import { useState, useEffect } from "react"
import { useCurrencyStore } from "@/lib/currency-store"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Globe } from "lucide-react"

const currencies = ["USD", "GHS"] as const

export default function CurrencySwitcher() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const { currency, setCurrency } = useCurrencyStore()

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[60]">
      <div className="relative flex items-center">
        
        {/* DROPDOWN */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-full mr-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden min-w-[100px]"
            >
              {currencies.map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    setCurrency(code)
                    setOpen(false)
                  }}
                  className={`w-full px-5 py-3 text-xs font-bold text-left transition ${
                    currency === code ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {code} {code === 'USD' ? '🇺🇸' : '🇬🇭'}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FLOATING PILL */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-gray-900 text-white pl-4 pr-3 py-3 rounded-l-full shadow-2xl hover:bg-black transition-all active:scale-95 group"
        >
          <span className="text-xs font-bold tracking-widest">{currency}</span>
          <ChevronLeft size={14} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  )
}