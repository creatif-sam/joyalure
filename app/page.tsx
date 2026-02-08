"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { subscribeToNewsletter } from "./actions"; 
import BackgroundSlider from "@/components/coming-soon/BackgroundSlider";
import CountdownTimer from "@/components/coming-soon/CountdownTimer";
import NewsletterSection from "@/components/coming-soon/NewsletterSection";

// Refined Animations (slighter movement for elegance)
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function JoyAllureComingSoon() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);

  const slides = [
    "/images/skin-care-1.jpg",
    "/images/skin-1.png",
    "/images/skin-care-3.png",
    "/images/back-2.jpeg",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("Sending...");

    try {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        setIsSuccessOpen(true);
        setStatus(""); 
        setEmail(""); 
      } else if (result.isDuplicate) {
        setIsDuplicateOpen(true);
        setStatus("");
        setEmail("");
      } else {
        setStatus(result.error || "Something went wrong.");
      }
    } catch (error) {
      setStatus("Error connecting to server.");
    }
  };

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(slideTimer);
  }, [slides.length]);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans selection:bg-green-500/30">
      
      <BackgroundSlider slides={slides} currentIndex={slideIndex} />

      {/* Header UI */}
      <div className="absolute top-6 lg:top-8 left-6 lg:left-10 right-6 lg:right-10 flex justify-between items-center z-40">
        <button onClick={() => setShowInfo(true)} className="flex items-center gap-3 group">
          <div className="w-7 h-7 border border-white/20 rounded-full flex items-center justify-center group-hover:border-green-500 transition-all duration-500">
            <div className="w-2.5 h-[1px] bg-white group-hover:bg-green-500" />
          </div>
          <span className="text-[9px] tracking-[0.3em] font-bold uppercase hidden sm:block opacity-70 group-hover:opacity-100 transition-opacity">
            More Info
          </span>
        </button>
        <div className="text-base lg:text-lg font-serif italic select-none">
          JoyAlure<span className="text-green-500">.</span>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* Left: Timer Column */}
        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="lg:col-span-5 flex flex-col justify-center p-8 md:p-16 bg-black/20 backdrop-blur-[1px] pt-28 lg:pt-0 border-white/5 lg:border-r"
        >
          <motion.p variants={fadeInUp} className="text-green-400 tracking-[0.4em] text-[9px] font-bold mb-3 uppercase">
            Launching Soon
          </motion.p>
          <CountdownTimer fadeInUp={fadeInUp} />
        </motion.div>

        {/* Right: Content Column */}
        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="lg:col-span-7 flex flex-col justify-center p-8 md:p-20 py-16 lg:py-0"
        >
          <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl lg:text-5xl font-serif leading-[1.3] mb-6 max-w-xl">
            We are crafting a <span className="italic text-green-500">premium experience</span> for your body.
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-gray-400 text-sm md:text-base leading-relaxed max-w-md mb-10 font-light">
            At Joyalure, we believe skincare should be as <strong>kind as it is powerful.</strong> 
            Based in Texas and formulated in Korea, we bridge the gap between science and nature to bring you high-performance, dermatologist-tested solutions.
            
            <span className="flex flex-wrap gap-x-4 gap-y-2 mt-6 text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase items-center">
              <span className="flex items-center gap-1.5">🌿 Vegan & Cruelty-Free</span>
              <span className="text-gray-700 hidden md:block">|</span>
              <span className="flex items-center gap-1.5">🇰🇷 K-Beauty Standards</span>
              <span className="text-gray-700 hidden md:block">|</span>
              <span className="flex items-center gap-1.5">✨ Radiant Wellness</span>
            </span>
          </motion.p>
          
          <NewsletterSection 
            email={email} 
            setEmail={setEmail} 
            handleSubmit={handleSubmit} 
            status={status} 
            fadeInUp={fadeInUp} 
          />
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-10 text-[8px] tracking-[0.2em] text-white/20 uppercase">
        © {new Date().getFullYear()} JoyAlure Studio
      </div>

      {/* POPUP MODALS */}
      <AnimatePresence>
        {isSuccessOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-sm w-full bg-[#0a0a0a] border border-white/10 p-10 text-center relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-green-500" />
              <div className="mb-4 flex justify-center text-green-500">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h3 className="text-xl font-serif mb-2">You're on the list.</h3>
              <p className="text-gray-400 text-xs mb-6">Stay tuned for our premium collection launch.</p>
              <button onClick={() => setIsSuccessOpen(false)} className="px-6 py-2.5 border border-white/20 text-[9px] uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all">Close</button>
            </motion.div>
          </motion.div>
        )}

        {isDuplicateOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-sm w-full bg-[#0a0a0a] border border-white/10 p-10 text-center relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-yellow-500" />
              <div className="mb-4 text-yellow-500 text-3xl font-serif">!</div>
              <h3 className="text-xl font-serif mb-2">We've met before!</h3>
              <p className="text-gray-400 text-xs mb-6">This email is already registered for updates.</p>
              <button onClick={() => setIsDuplicateOpen(false)} className="px-6 py-2.5 border border-white/20 text-[9px] uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all">Got it</button>
            </motion.div>
          </motion.div>
        )}

        {showInfo && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30 }} className="fixed inset-0 z-[150] bg-[#0a0a0a] flex flex-col lg:flex-row">
            <div className="flex-1 p-8 md:p-20 flex flex-col justify-center relative">
              <button onClick={() => setShowInfo(false)} className="absolute top-10 right-10 text-[9px] tracking-widest font-bold uppercase py-2">[ X Close ]</button>
              <h3 className="text-4xl md:text-6xl font-serif mb-8 text-green-500">About the Brand</h3>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-12 font-light">
                ✨ Joyalure: Your Glow, Reimagined. Dermatologist-tested, cruelty-free skincare from Korea to Fort Worth. Shop the collection today! 🧴💖
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/10 pt-10">
                <div>
                  <span className="block text-green-500 text-[10px] uppercase tracking-widest font-bold mb-2">Connect</span>
                  <p className="text-base md:text-lg">hello@joyallure.com</p>
                </div>
                <div>
                  <span className="block text-green-500 text-[10px] uppercase tracking-widest font-bold mb-2">Location</span>
                  <p className="text-base md:text-lg">Fort Worth, Texas, United States</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block lg:w-1/4 bg-green-500/5 border-l border-white/5" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}