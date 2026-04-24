"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

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
    name: "Abena Ako",
    country: "United States",
    flag: "https://flagcdn.com/w20/us.png",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    review:
      "Joy Allure Shea Butter is a game-changer! Light, warm scent; silky texture that melts right in. Skin stays soft and hydrated for 24+ hours with zero greasiness. Deep nourishment that actually lasts. A must-have!"
  },
  {
    name: "Abena",
    country: "United States",
    flag: "https://flagcdn.com/w20/us.png",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    review:
      "I received my package few minutes ago and was immediately intrigued to try it out! It really has a beautiful buttery consistency and instantly adds a nourishing and shimmering glow to the skin."
  },
  {
    name: "Menaoye",
    country: "United States",
    flag: "https://flagcdn.com/w20/us.png",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 5,
    review:
      "Fantastic product. My family loves it especially my son who has eczema."
  },
  {
    name: "Hagar Bauah",
    country: "United States",
    flag: "https://flagcdn.com/w20/us.png",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 5,
    review:
      "Is 10/10 minus nothing. Am definitely going back for more. Highly recommended for dry skin. Try it out and thank me later 👌"
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
    <section className="bg-white dark:bg-zinc-950 py-24 px-4 overflow-hidden transition-colors duration-500">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-black tracking-tighter text-gray-900 dark:text-zinc-100 mb-12 uppercase"
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
              className="bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] p-10 shadow-sm border border-zinc-100 dark:border-zinc-800 max-w-xl mx-auto"
            >
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < testimonial.rating
                        ? "text-yellow-400"
                        : "text-zinc-200 dark:text-zinc-700"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed mb-8 text-lg">
                “{testimonial.review}”
              </p>

              <div className="flex justify-center items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-zinc-800 shadow-sm"
                />

                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-zinc-100">
                      {testimonial.name}
                    </p>
                    <img
                      src={testimonial.flag}
                      alt={testimonial.country}
                      className="w-4 h-3 rounded-sm object-cover"
                    />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-500">
                    {testimonial.country}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? "bg-green-600 w-8"
                    : "bg-zinc-300 dark:bg-zinc-800 hover:bg-zinc-400 dark:hover:bg-zinc-700"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          {/* See More Link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12"
          >
            <Link
              href="/testimonies"
              className="inline-flex items-center gap-2 text-sm font-bold text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-colors group"
            >
              See More Testimonies
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}