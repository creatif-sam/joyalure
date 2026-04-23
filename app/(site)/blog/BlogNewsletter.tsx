"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToNewsletter } from "@/lib/actions/newsletter"; // Adjust path

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function BlogNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("Sending...");

    try {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        setStatus("Thank you for joining!");
        setEmail("");
      } else if (result.isDuplicate) {
        setStatus("You're already on the list.");
        setEmail("");
      } else {
        setStatus(result.error || "Something went wrong.");
      }
    } catch (error) {
      setStatus("Error connecting to server.");
    }
    
    // Clear status message after 5 seconds
    setTimeout(() => setStatus(""), 5000);
  };

  return (
    <motion.div 
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={fadeInUp} 
      className="relative max-w-md mx-auto group mt-8"
    >
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="email" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full bg-transparent border-b border-zinc-300 dark:border-white/20 py-4 outline-none focus:border-green-500 transition-all duration-500 font-light text-lg pr-32 dark:text-white text-zinc-900"
        />
        <motion.button 
          type="submit" 
          className="absolute right-0 bottom-4 text-green-600 dark:text-green-400 uppercase tracking-widest text-[10px] font-bold hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Notify Me
        </motion.button>
      </form>
      <AnimatePresence>
        {status && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }} 
            className="absolute mt-4 text-[10px] text-green-600 dark:text-green-400 uppercase tracking-widest font-bold"
          >
            {status}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}