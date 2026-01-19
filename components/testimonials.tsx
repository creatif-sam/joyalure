"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Testimonial = {
  name: string
  country: string
  flag: string
  avatar: string
  rating: number
  review: string
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah M.",
    country: "United States",
    flag: "https://flagcdn.com/w20/us.png",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    review:
      "My skin feels calmer and more hydrated than ever. Joyalure products are gentle but truly effective."
  },
  {
    name: "Michelle R.",
    country: "United Kingdom",
    flag: "https://flagcdn.com/w20/us.png",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    review:
      "I love how clean and lightweight the formulas are. No irritation at all, just healthy glowing skin."
  },
  {
    name: "Nana A.",
    country: "Ghana",
    flag: "https://flagcdn.com/w20/gh.png",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 4,
    review:
      "Finally a skincare brand that works well in warmer climates. My skin looks balanced and fresh."
  }
]

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0)
  const startX = useRef<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [])

  function handleTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (startX.current === null) return

    const endX = e.changedTouches[0].clientX
    const diff = startX.current - endX

    if (diff > 50) {
      setIndex((prev) => (prev + 1) % testimonials.length)
    }

    if (diff < -50) {
      setIndex((prev) =>
        prev === 0 ? testimonials.length - 1 : prev - 1
      )
    }

    startX.current = null
  }

  const testimonial = testimonials[index]

  return (
    <section className="bg-white py-24 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-semibold text-gray-900 mb-12"
        >
          Loved By Customers Worldwide
        </motion.h2>

        <div
          className="relative touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-50 rounded-2xl p-10 shadow-sm max-w-xl mx-auto"
            >
              {/* Stars */}
              <div className="flex justify-center mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < testimonial.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed mb-8">
                “{testimonial.review}”
              </p>

              <div className="flex justify-center items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
                />

                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {testimonial.name}
                    </p>
                    <img
                      src={testimonial.flag}
                      alt={testimonial.country}
                      className="w-4 h-4 rounded-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {testimonial.country}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  i === index
                    ? "bg-green-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
