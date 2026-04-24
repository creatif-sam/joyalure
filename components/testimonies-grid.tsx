"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star, CheckCircle, MapPin, Calendar } from "lucide-react"
import type { Testimony } from "@/lib/supabase/testimonies"

export default function TestimoniesGrid({ testimonies }: { testimonies: Testimony[] }) {
  const [filter, setFilter] = useState<"all" | "featured" | "5-star">("all")

  const filtered = testimonies.filter((t) => {
    if (filter === "featured") return t.is_featured
    if (filter === "5-star") return t.rating === 5
    return true
  })

  return (
    <>
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

      {/* Testimonies Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
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
                {filtered.map((testimony, index) => (
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
                        {testimony.rating != null && (
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < testimony.rating!
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-gray-300 text-gray-300 dark:fill-zinc-700 dark:text-zinc-700"
                                }
                              />
                            ))}
                          </div>
                        )}
                      </div>

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
    </>
  )
}
