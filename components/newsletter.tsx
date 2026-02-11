"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToNewsletter } from "@/lib/actions/newsletter"; 
import { Loader2, CheckCircle2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setStatus("Sending...");

    try {
      const result = await subscribeToNewsletter(email);
      
      if (result.success) {
        setStatus("Thank you! You have been subscribed.");
        setEmail("");
      } else if (result.isDuplicate) {
        setStatus("You're already part of the community.");
        setEmail("");
      } else {
        setStatus(result.error || "Something went wrong.");
      }
    } catch (error) {
      setStatus("Error connecting to server.");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 6000);
    }
  }

  return (
    <section className="bg-white dark:bg-zinc-950 py-24 px-4 overflow-hidden transition-colors duration-500">
      <div className="max-w-4xl mx-auto text-center">
        {/* Title: Inverted for Dark Mode */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 dark:text-zinc-100 mb-6 italic uppercase"
        >
          Stay In Touch With JOYALURE
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 dark:text-zinc-400 text-sm md:text-lg mb-12 leading-relaxed font-medium"
        >
          Stay in the loop and be the first to get exclusive discounts, <br className="hidden md:block" /> 
          new product updates, and editorial insights.
        </motion.p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center justify-center gap-4 relative"
        >
          <div className="relative w-full md:w-[420px]">
            <input
              type="email"
              required
              placeholder="E-mail Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full
                px-6 py-4
                border border-gray-200 dark:border-zinc-800
                rounded-xl
                bg-white dark:bg-zinc-900
                text-gray-900 dark:text-zinc-100
                text-sm
                transition-all duration-500 ease-out
                hover:border-green-600 dark:hover:border-green-500
                focus:bg-green-50/30 dark:focus:bg-green-500/5 focus:border-green-600 dark:focus:border-green-500
                focus:outline-none
                placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest placeholder:font-black placeholder:text-gray-400 dark:placeholder:text-zinc-600
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full md:w-auto
              px-12 py-4
              rounded-xl
              border border-black dark:border-zinc-700
              bg-black dark:bg-zinc-100
              text-white dark:text-zinc-900
              text-[10px]
              font-black tracking-widest uppercase
              transition-all duration-500 ease-out
              hover:bg-green-600 hover:border-green-600 dark:hover:bg-green-500 dark:hover:border-green-500 dark:hover:text-white
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-95
              flex items-center justify-center gap-2
            "
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "SUBSCRIBE"}
          </button>

          {/* Status Message: Themed Green */}
          <AnimatePresence>
            {status && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -bottom-10 left-0 right-0 flex justify-center items-center gap-2"
              >
                {status.includes("Thank you") && <CheckCircle2 size={14} className="text-green-600 dark:text-green-400" />}
                <span className="text-[10px] font-black uppercase tracking-widest text-green-700 dark:text-green-400">
                  {status}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}