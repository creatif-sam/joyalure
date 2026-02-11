"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { toast } from "sonner"
import { sendContactMessage } from "./contact"

export default function ContactPage() {
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    
    try {
      const result = await sendContactMessage(formData)
      
      if (result.success) {
        toast.success("Message sent! We'll get back to you shortly.")
        // Optionally reset the form here
        const formElement = document.getElementById("contact-form") as HTMLFormElement
        formElement?.reset()
      } else {
        toast.error(result.error || "Failed to send message.")
      }
    } catch (err) {
      toast.error("An unexpected error occurred.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <main className="bg-white dark:bg-zinc-950 transition-colors duration-300">

      {/* HERO */}
      <section className="py-28 px-4 bg-gradient-to-b from-green-50 to-white dark:from-zinc-900 dark:to-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-black tracking-tight text-gray-900 dark:text-zinc-100 mb-6"
          >
            Contact Us
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-lg text-gray-600 dark:text-zinc-400 leading-relaxed font-medium"
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
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-zinc-100 mb-6">
              Get in touch
            </h2>

            <p className="text-gray-700 dark:text-zinc-400 leading-relaxed mb-8 max-w-md font-medium">
              Our team responds within 24 to 48 hours. We value thoughtful,
              honest conversations and are always happy to assist.
            </p>

            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700 dark:text-green-500 mb-2">
                  Email
                </p>
                <p className="text-gray-800 dark:text-zinc-200 font-bold text-lg">support@joyalure.com</p>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700 dark:text-green-500 mb-2">
                  Address
                </p>
                <p className="text-gray-800 dark:text-zinc-200 font-medium leading-relaxed">
                  Chez Joy Gyamfi<br />
                  Yes Tik, Texas<br />
                  United States
                </p>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700 dark:text-green-500 mb-2">
                  Hours
                </p>
                <p className="text-gray-800 dark:text-zinc-200 font-medium">Monday to Friday, 9am to 5pm</p>
              </div>
            </div>
          </motion.div>

          {/* FORM */}
          <motion.form
            id="contact-form"
            action={handleSubmit}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 dark:border-zinc-800 p-10 space-y-6"
          >
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-2 ml-1">
                Full name
              </label>
              <input
                name="full_name"
                type="text"
                required
                disabled={isPending}
                placeholder="Joy Gyamfi"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all placeholder:text-gray-300 dark:placeholder:text-zinc-700 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-2 ml-1">
                Email address
              </label>
              <input
                name="email"
                type="email"
                required
                disabled={isPending}
                placeholder="joy@example.com"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all placeholder:text-gray-300 dark:placeholder:text-zinc-700 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-2 ml-1">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                required
                disabled={isPending}
                placeholder="Tell us how we can help..."
                className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all resize-none placeholder:text-gray-300 dark:placeholder:text-zinc-700 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-5 rounded-2xl bg-[#d4af37] text-black font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 hover:bg-green-600 hover:text-white shadow-lg shadow-[#d4af37]/20 hover:shadow-green-600/20 active:scale-[0.98] disabled:bg-gray-200 dark:disabled:bg-zinc-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isPending ? "Sending..." : "Send message"}
            </button>
          </motion.form>
        </div>
      </section>
    </main>
  )
}