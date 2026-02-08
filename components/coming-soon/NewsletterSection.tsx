"use client";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  email: string;
  setEmail: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  status: string;
  fadeInUp: any;
}

export default function NewsletterSection({ email, setEmail, handleSubmit, status, fadeInUp }: Props) {
  return (
    <motion.div variants={fadeInUp} className="relative max-w-md group">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-green-500 transition-all duration-500 font-light text-lg pr-32"
        />
        <motion.button type="submit" className="absolute right-0 bottom-4 text-green-400 uppercase tracking-widest text-[10px] font-bold hover:text-white transition-colors">
          Notify Me
        </motion.button>
      </form>
      <AnimatePresence>
        {status && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute mt-4 text-[10px] text-green-400 uppercase tracking-widest font-bold">
            {status}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}