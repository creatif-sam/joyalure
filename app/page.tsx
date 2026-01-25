"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CloseButton from "../components/CloseButton";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function JoyAllureComingSoon() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [slideIndex, setSlideIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const slides = [
    "/images/skin-care-1.jpg",
    "/images/skin-1.png",
    "/images/skin-care-3.png",
  ];

  // Typing animation text
  const welcomeText = "WELCOME TO JOY ALLURE";
  const [typedWelcome, setTypedWelcome] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedWelcome(welcomeText.slice(0, i));
      i++;
      if (i > welcomeText.length) i = 0;
    }, 150);
    return () => clearInterval(interval);
  }, []);

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
    const slideTimer = setInterval(() => setSlideIndex((prev) => (prev + 1) % slides.length), 8000);
    return () => { clearInterval(interval); clearInterval(slideTimer); };
  }, [slides.length]);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans selection:bg-green-500/30">
      
      {/* Animated Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slideIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[slideIndex]})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* Left Section: Timer (Visual Focus) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          className="lg:col-span-5 flex flex-col justify-center p-8 md:p-16 lg:p-24 border-r border-white/5"
        >
          <motion.p variants={fadeInUp} className="text-green-400 tracking-[0.3em] text-xs font-bold mb-4 uppercase">
            Launching In
          </motion.p>
          
          <motion.div variants={fadeInUp} className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter">
              {String(timeLeft.days).padStart(2, "0")}
              <span className="text-xl md:text-2xl font-serif italic text-green-500 ml-4">days</span>
            </h1>
            <div className="flex gap-8 text-2xl md:text-4xl font-extralight text-white/50">
              <div className="flex flex-col">
                <span>{String(timeLeft.hours).padStart(2, "0")}</span>
                <span className="text-[10px] uppercase tracking-widest text-green-400 font-bold">Hours</span>
              </div>
              <div className="flex flex-col">
                <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
                <span className="text-[10px] uppercase tracking-widest text-green-400 font-bold">Mins</span>
              </div>
              <div className="flex flex-col">
                <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
                <span className="text-[10px] uppercase tracking-widest text-green-400 font-bold">Secs</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Section: Content */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          className="lg:col-span-7 flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-black/20 backdrop-blur-sm"
        >
          <motion.div variants={fadeInUp} className="mb-6 h-6">
            <span className="text-green-400 font-mono text-sm tracking-widest">{typedWelcome}</span>
            <span className="animate-pulse text-green-400">_</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-serif leading-[1.1] mb-8 max-w-2xl">
            A sanctuary for <span className="italic text-green-500">body wellness</span> is being crafted.
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-gray-400 text-lg leading-relaxed max-w-lg mb-12">
            Joy Allure is redefining body care. We are preparing a luxurious digital experience 
            dedicated to the art of skin nourishment.
          </motion.p>

          <motion.form 
            variants={fadeInUp}
            onSubmit={(e) => e.preventDefault()} 
            className="relative max-w-md group"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-green-500 transition-colors duration-500 font-light text-xl"
            />
            <button className="absolute right-0 bottom-4 text-green-400 uppercase tracking-widest text-xs font-bold hover:text-white transition-colors">
              Notify Me
            </button>
          </motion.form>
        </motion.div>
      </div>

      {/* Luxury Navigation Overlay */}
      <button
        onClick={() => setShowInfo(true)}
        className="absolute top-8 left-8 flex items-center gap-4 group z-50"
      >
        <div className="relative w-10 h-10 border border-white/10 rounded-full flex items-center justify-center group-hover:border-green-500 transition-colors">
          <div className="w-4 h-[1px] bg-white group-hover:bg-green-500 transition-colors" />
          <div className="w-4 h-[1px] bg-white absolute translate-y-1.5 group-hover:bg-green-500 transition-colors" />
        </div>
        <span className="text-[10px] tracking-[0.4em] font-bold uppercase group-hover:text-green-400 transition-colors">Information</span>
      </button>

      <div className="absolute top-8 right-8 text-xl font-serif italic tracking-tight z-50">
        Joy Allure<span className="text-green-500">.</span>
      </div>

      {/* Social Bar */}
      <div className="absolute bottom-8 right-8 flex gap-8 z-50">
        {['Instagram', 'TikTok', 'Facebook'].map((social) => (
          <a key={social} href="#" className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-500 hover:text-green-400 transition-colors">
            {social}
          </a>
        ))}
      </div>

      {/* Slide-out Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col md:flex-row"
          >
            <div className="flex-1 p-12 md:p-24 flex flex-col justify-center">
              <button onClick={() => setShowInfo(false)} className="absolute top-12 right-12 text-white/50 hover:text-white text-sm tracking-widest uppercase">
                [ Close ]
              </button>
              <h3 className="text-5xl font-serif mb-8 text-green-500">Our Essence</h3>
              <p className="text-gray-400 text-xl leading-relaxed max-w-xl mb-12">
                Specializing exclusively in body products, we believe skin health extends far beyond the face. 
                Our studio in Texas is currently developing a range of essentials designed for luxury and results.
              </p>
              <div className="grid grid-cols-2 gap-12 border-t border-white/10 pt-12">
                <div>
                  <h4 className="text-xs tracking-widest uppercase text-green-400 font-bold mb-4">Inquiries</h4>
                  <p className="text-lg font-light">hello@joyallure.com</p>
                </div>
                <div>
                  <h4 className="text-xs tracking-widest uppercase text-green-400 font-bold mb-4">Studio</h4>
                  <p className="text-lg font-light">Texas, United States</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block w-1/3 bg-green-900/10 border-l border-white/5" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}