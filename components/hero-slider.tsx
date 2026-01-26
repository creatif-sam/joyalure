"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

const SLIDE_DURATION = 7000

const slides = [
  {
    id: 1,
    type: "image",
    src: "images/skin-care-2.png",
    tag: "ORGANIC SKINCARE",
    title: "Radiance Without Irritation",
    cta: "Shop Now",
    link: "/products"
  },
  {
    id: 2,
    type: "video",
    src: "/videos/coverr-woman-video.mp4",
    tag: "CLINICALLY INSPIRED",
    title: "Gentle Care Powered By Nature",
    cta: "Discover",
    link: "/products"
  },
  {
    id: 3,
    type: "image",
    src: "images/skin-care-1.jpg",
    tag: "CLEAN BEAUTY",
    title: "Vegan Formulas For Every Skin",
    cta: "Explore",
    link: "/about"
  }
]

export default function HeroSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, SLIDE_DURATION)

    return () => clearInterval(timer)
  }, [])

  const slide = slides[index]

  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {slide.type === "image" ? (
            <img
              src={slide.src}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={slide.src}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-black bg-opacity-30" />

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white text-sm tracking-widest mb-4"
              >
                {slide.tag}
              </motion.p>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white text-5xl md:text-6xl font-semibold max-w-xl leading-tight mb-8"
              >
                {slide.title}
              </motion.h1>

              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
               <Link
  href={slide.link}
  className="
    inline-block
    px-10 py-4
    rounded-sm
    bg-yellow-500
    text-white
    text-sm
    tracking-wide
    transition-colors
    duration-500
    hover:bg-green-600
  "
>
  {slide.cta}
</Link>

              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Right corner loading dots */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="relative w-2.5 h-2.5"
            aria-label={`Go to slide ${i + 1}`}
          >
            <span
              className={`absolute inset-0 rounded-full ${
                i === index ? "bg-white" : "bg-white bg-opacity-40"
              }`}
            />

            {i === index && (
              <span className="absolute inset-0 rounded-full border border-white animate-dot-progress" />
            )}
          </button>
        ))}
      </div>
    </section>
  )
}
