"use client"

import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <main className="bg-white">

      {/* ORIGIN STORY */}
      <section className="py-28 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          
          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <p className="uppercase tracking-widest text-sm text-green-700 mb-4">
              Our beginnings
            </p>

            <h2 className="text-4xl font-semibold text-gray-900 mb-8">
              Where it all started
            </h2>

            <div className="space-y-5 text-gray-700 leading-relaxed max-w-xl">
              <p>
                Joyalure was founded from a deeply personal journey. After years of
                struggling with products that promised results but delivered
                irritation, we realized something was missing in skincare.
              </p>

              <p>
                Too many formulas were aggressive. Too many brands prioritized
                trends over skin health. We believed there had to be a better way.
              </p>

              <p>
                So we set out to create skincare that is gentle, effective, and
                honest. Products that respect your skin barrier, your body, and
                the world around you.
              </p>
            </div>
          </motion.div>

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex justify-center md:justify-end"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883"
                alt="Joyalure skincare origins"
                className="w-72 h-72 object-cover rounded-3xl shadow-lg"
              />
              <span className="absolute -bottom-5 -right-5 w-full h-full rounded-3xl border border-green-200" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CEO STORY */}
      <section className="py-28 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[220px_1fr] gap-14 items-start">
          
          {/* IMAGE */}
          <div className="flex justify-center md:justify-start">
            <div className="relative">
              <img
                src="/images/joy.png"
                alt="Founder and CEO of Joyalure"
                className="w-52 h-64 object-cover rounded-3xl shadow-lg"
              />
              <span className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl border border-green-200" />
            </div>
          </div>

          {/* TEXT */}
          <div>
            <p className="uppercase tracking-widest text-xs text-green-700 mb-3">
              From our founder
            </p>

            <h2 className="text-4xl font-semibold text-gray-900 mb-6">
              Meet our CEO
            </h2>

            <div className="space-y-4 text-gray-700 leading-relaxed max-w-2xl">
              <p>
                Joyalure is led by a belief that skincare should feel like self
                respect, not self correction. Our CEO founded the brand with a
                commitment to transparency, integrity, and long term skin health.
              </p>

              <p>
                Every formula is developed with intention. Every ingredient is
                chosen for a reason. And every product is designed to support,
                not overwhelm, your skin.
              </p>
            </div>

            <div className="mt-8 border-l-2 border-green-600 pl-6">
              <p className="text-lg text-gray-900 font-medium italic">
                “Skincare should never hurt to work.”
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Founder & CEO, Joyalure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-16">
            What we believe in
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-medium mb-4 text-green-700">
                Gentle by design
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our formulas work with your skin, not against it. No harsh
                chemicals. No unnecessary irritation.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-medium mb-4 text-green-700">
                Vegan and cruelty free
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every product is made without animal derived ingredients and is
                never tested on animals.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-medium mb-4 text-green-700">
                Honest beauty
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We believe trust is built through transparency. What you see on
                our label is exactly what your skin receives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Our mission
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed">
            Our mission is to empower confidence through care. We create skincare
            that supports real skin, real lives, and real routines. Joyalure is
            not about perfection. It is about balance, intention, and feeling
            at home in your skin.
          </p>
        </div>
      </section>

    </main>
  )
}
