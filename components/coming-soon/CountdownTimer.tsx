"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CountdownTimer({ fadeInUp }: { fadeInUp: any }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const launchDate = new Date().getTime() + 21 * 24 * 60 * 60 * 1000;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = launchDate - now;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div variants={fadeInUp} className="space-y-4">
      <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight tracking-tighter">
        {String(timeLeft.days).padStart(2, "0")}
        <span className="text-lg md:text-xl font-serif italic text-green-500 ml-4 tracking-normal">days</span>
      </h1>
      <div className="flex gap-6 md:gap-10 text-2xl md:text-4xl font-thin text-white/40">
        {['Hours', 'Mins', 'Secs'].map((label, idx) => (
          <div key={label} className="flex flex-col">
            <span className="text-white">
              {String(Object.values(timeLeft)[idx + 1]).padStart(2, "0")}
            </span>
            <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-green-500 font-bold mt-2">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}