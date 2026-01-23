"use client"

import { motion } from "framer-motion"

export default function ContactPage() {
  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="py-28 px-4 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-semibold text-gray-900 mb-6"
          >
            Contact Us
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            We are here to help. Whether you have a question about our products,
            your order, or skincare in general, we would love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-start">

          {/* INFO */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Get in touch
            </h2>

            <p className="text-gray-700 leading-relaxed mb-8 max-w-md">
              Our team responds within 24 to 48 hours. We value thoughtful,
              honest conversations and are always happy to assist.
            </p>

            <div className="space-y-6 text-gray-700">
              <div>
                <p className="text-sm uppercase tracking-wider text-green-700 mb-1">
                  Email
                </p>
                <p>support@joyalure.com</p>
              </div>

              <div>
                <p className="text-sm uppercase tracking-wider text-green-700 mb-1">
                  Address
                </p>
                <p>
                  Chez Joy Gyamfi<br />
                  Yes Tik, Texas<br />
                  United States
                </p>
              </div>

              <div>
                <p className="text-sm uppercase tracking-wider text-green-700 mb-1">
                  Hours
                </p>
                <p>Monday to Friday, 9am to 5pm</p>
              </div>
            </div>
          </motion.div>

          {/* FORM */}
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 space-y-6"
          >
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Full name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-600 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-600 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Message
              </label>
              <textarea
                rows={5}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-600 transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-md bg-[#d4af37] text-black font-medium transition-colors duration-300 hover:bg-green-600 hover:text-white"
            >
              Send message
            </button>
          </motion.form>
        </div>
      </section>

    </main>
  )
}
