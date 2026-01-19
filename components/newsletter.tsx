"use client"

import { useState } from "react"

export default function Newsletter() {
  const [email, setEmail] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setEmail("")
  }

  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-semibold text-gray-900 mb-6">
          Stay In Touch With JOYALURE
        </h2>

        <p className="text-gray-600 text-lg mb-12 leading-relaxed">
          Stay in the loop and be the first to get exclusive discounts, new product updates, and more.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <input
            type="email"
            required
            placeholder="E mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full md:w-[420px]
              px-5 py-4
              border border-gray-300
              rounded-md
              bg-white
              text-gray-900
              transition-all duration-500 ease-out
              hover:bg-green-50 hover:border-green-600
              focus:bg-green-50 focus:border-green-600
              focus:outline-none
            "
          />

         <button
  type="submit"
  className="
    w-full md:w-auto
    px-12 py-4
    rounded-md
    border border-black
    bg-transparent
    text-black
    font-medium tracking-wide
    transition-all duration-500 ease-out
    hover:bg-green-600 hover:border-green-600 hover:text-white
    focus:bg-green-600 focus:border-green-600 focus:text-white
    focus:outline-none
  "
>
  SUBSCRIBE
</button>

        </form>
      </div>
    </section>
  )
}
