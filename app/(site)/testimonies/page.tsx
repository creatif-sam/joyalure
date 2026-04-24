"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, CheckCircle, MapPin, Calendar } from "lucide-react"

type Testimony = {
  id: string
  customer_name: string
  customer_location: string | null
  testimony_text: string | null
  screenshot_url: string
  rating: number | null
  platform: string | null
  verified_purchase: boolean
  testimony_date: string | null
  is_featured: boolean
  is_active: boolean
  display_order: number
}

export default function TestimoniesPage() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "featured" | "5-star">("all")

  useEffect(() => {
    async function fetchTestimonies() {
      try {
        const response = await fetch("/api/testimonies")
        const data = await response.json()
        setTestimonies(data.testimonies || [])
      } catch (error) {
        console.error("Failed to fetch testimonies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonies()
  }, [])

  const filteredTestimonies = testimonies.filter((t) => {
    if (filter === "featured") return t.is_featured
    if (filter === "5-star") return t.rating === 5
    return true
  })

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(22,163,74,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-500 transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-gray-900 dark:text-zinc-100 mb-4 uppercase">
              Customer <span className="text-green-600">Testimonies</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-zinc-400 max-w-2xl">
              Real experiences from our valued customers around the world. See what they have to say about Joyalure.
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex gap-3 mt-8"
          >
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === "all"
                  ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                  : "bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-800"
              }`}
            >
              All Testimonies
            </button>
            <button
              onClick={() => setFilter("featured")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                filter === "featured"
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                  : "bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-800"
              }`}
            >
              <Star size={14} className="fill-current" />
              Featured
            </button>
            <button
              onClick={() => setFilter("5-star")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === "5-star"
                  ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                  : "bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-800"
              }`}
            >
              5 Star Only
            </button>
          </motion.div>
        </div>
      </section>

      {/* Testimonies Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
              <p className="text-gray-600 dark:text-zinc-400 mt-4">Loading testimonies...</p>
            </div>
          ) : filteredTestimonies.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-600 dark:text-zinc-400 text-lg">
                No testimonies found for this filter.
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredTestimonies.map((testimony, index) => (
                  <motion.div
                    key={testimony.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                  >
                    {/* Screenshot */}
                    <div className="relative h-80 bg-gray-50 dark:bg-zinc-800">
                      <Image
                        src={testimony.screenshot_url}
                        alt={`${testimony.customer_name}'s testimony`}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {testimony.is_featured && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1 shadow-lg">
                            <Star size={12} className="fill-current" />
                            Featured
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-black text-lg text-gray-900 dark:text-zinc-100">
                            {testimony.customer_name}
                          </h3>
                          {testimony.customer_location && (
                            <p className="text-xs text-gray-500 dark:text-zinc-500 flex items-center gap-1 mt-1">
                              <MapPin size={12} />
                              {testimony.customer_location}
                            </p>
                          )}
                        </div>
                        {testimony.rating && (
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < (testimony.rating ?? 0)
                      {testimony.testimony_text && (
                        <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed mb-4">
                          &ldquo;{testimony.testimony_text}&rdquo;
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 items-center">
                        {testimony.verified_purchase && (
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                            <CheckCircle size={12} />
                            Verified Purchase
                          </span>
                        )}
                        {testimony.platform && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full font-bold">
                            {testimony.platform}
                          </span>
                        )}
                        {testimony.testimony_date && (
                          <span className="text-xs text-gray-500 dark:text-zinc-500 flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(testimony.testimony_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-green-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-gray-900 dark:text-zinc-100 mb-4 uppercase">
              Join Thousands of Happy Customers
            </h2>
            <p className="text-lg text-gray-600 dark:text-zinc-400 mb-8">
              Experience the Joyalure difference for yourself
            </p>
            <Link
              href="/products"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-md font-black uppercase tracking-widest text-sm transition-all active:scale-95 shadow-lg shadow-green-600/20"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
