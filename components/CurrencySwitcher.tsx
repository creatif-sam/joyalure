"use client"

import { useState } from "react"

const currencies = ["USD", "GHS"]

export default function CurrencySwitcher() {
  const [open, setOpen] = useState(false)
  const [currency, setCurrency] = useState("USD")

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
      <div className="relative">

        {/* PILL */}
        <button
          onClick={() => setOpen(!open)}
          className="
            bg-black text-white
            px-4 py-2
            rounded-l-full
            text-sm font-medium
            shadow-lg
            hover:bg-gray-900
            transition
          "
        >
          {currency}
        </button>

        {/* DROPDOWN */}
        {open && (
          <div
            className="
              absolute right-full top-1/2 -translate-y-1/2 mr-2
              bg-white
              border border-gray-100
              rounded-xl
              shadow-xl
              overflow-hidden
              min-w-[90px]
            "
          >
            {currencies.map((code) => (
              <button
                key={code}
                onClick={() => {
                  setCurrency(code)
                  setOpen(false)
                }}
                className={`
                  w-full px-4 py-3 text-sm text-left
                  hover:bg-gray-50
                  transition
                  ${
                    currency === code
                      ? "font-medium text-green-700"
                      : "text-gray-700"
                  }
                `}
              >
                {code}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
