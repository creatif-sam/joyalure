"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
// Ensure you create the actions.ts file provided below
import { subscribeToNewsletter } from "./actions"; 

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
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
    transition: { staggerChildren: 0.2 }
  }
};

const slideVariants: Variants = {
  initial: { opacity: 0, scale: 1.1 },
  animate: { opacity: 0.35, scale: 1, transition: { duration: 2.5, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 1.5 } }
};

export default function JoyAllureComingSoon() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [slideIndex, setSlideIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [typedWelcome, setTypedWelcome] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false); // New State

  const slides = [
    "/images/skin-care-1.jpg",
    "/images/skin-1.png",
    "/images/skin-care-3.png",
    "/images/back-2.jpeg",
  ];

  const welcomeText = "WELCOME TO JoyAlure";

  // Handle Form Submission
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
        setIsDuplicateOpen(true); // Open the duplicate popup
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

    const slideTimer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(slideTimer);
    };
  }, [slides.length]);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden font-sans selection:bg-green-500/30">
      
      {/* Background Section */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slideIndex}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[slideIndex]})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-black via-black/60 lg:via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* Left: Timer Column */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="lg:col-span-5 flex flex-col justify-center p-8 md:p-20 border-b lg:border-b-0 lg:border-r border-white/5 bg-black/20 lg:bg-black/10 backdrop-blur-[2px] pt-32 lg:pt-20"
        >
          <motion.p variants={fadeInUp} className="text-green-400 tracking-[0.4em] text-[10px] font-bold mb-4 uppercase">
            Launching Soon
          </motion.p>
          
          <motion.div variants={fadeInUp} className="space-y-4">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight tracking-tighter">
              {String(timeLeft.days).padStart(2, "0")}
              <span className="text-lg md:text-xl font-serif italic text-green-500 ml-4 tracking-normal">days</span>
            </h1>
            
            <div className="flex gap-6 md:gap-10 text-2xl md:text-4xl font-thin text-white/40">
              <div className="flex flex-col">
                <span className="text-white">{String(timeLeft.hours).padStart(2, "0")}</span>
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-green-500 font-bold mt-2">Hours</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white">{String(timeLeft.minutes).padStart(2, "0")}</span>
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-green-500 font-bold mt-2">Mins</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white">{String(timeLeft.seconds).padStart(2, "0")}</span>
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-green-500 font-bold mt-2">Secs</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Content Column */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="lg:col-span-7 flex flex-col justify-center p-8 md:p-20 py-20 lg:py-0"
        >
          <motion.div variants={fadeInUp} className="mb-6 font-mono text-[10px] md:text-xs tracking-widest text-green-400">
            {typedWelcome}<span className="animate-pulse">|</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl lg:text-6xl font-serif leading-[1.2] lg:leading-[1.1] mb-8 max-w-2xl">
            We are crafting a <span className="italic text-green-500">premium experience</span> for your body.
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 text-base md:text-lg leading-relaxed max-w-lg mb-12">
            At Joyalure, we believe skincare should be as <strong>kind as it is powerful. </strong>
            Based in Texas and formulated in Korea, we bridge the gap between science and nature to bring you high-performance, dermatologist-tested solutions.
            
            <span className="flex flex-wrap gap-4 mt-8 text-sm font-medium tracking-wide text-gray-300 uppercase">
              <span className="flex items-center gap-2">🌿 Vegan & Cruelty-Free</span>
              <span className="text-gray-600">|</span>
              <span className="flex items-center gap-2">🇰🇷 Premium K-Beauty Standards</span>
              <span className="text-gray-600">|</span>
              <span className="flex items-center gap-2">✨ Gentle, Effective, Radiant</span>
            </span>
          </motion.p>

          {/* Animated Email Section */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ x: 5 }}
            className="relative max-w-md group"
          >
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-green-500 transition-all duration-500 font-light text-lg pr-32"
              />
              <motion.button 
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-0 bottom-4 text-green-400 uppercase tracking-widest text-[10px] font-bold hover:text-white transition-colors"
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
                  className="absolute mt-4 text-[10px] text-green-400 uppercase tracking-[0.2em] font-bold"
                >
                  {status}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* Header UI Elements */}
      <div className="absolute top-6 lg:top-10 left-6 lg:left-10 right-6 lg:right-10 flex justify-between items-center z-40">
        <button
          onClick={() => setShowInfo(true)}
          className="flex items-center gap-4 group"
        >
          <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center group-hover:border-green-500 transition-all">
            <div className="w-3 h-[1px] bg-white group-hover:bg-green-500" />
          </div>
          <span className="text-[10px] tracking-[0.3em] font-bold uppercase hidden sm:block">More Info</span>
        </button>

        <div className="text-lg lg:text-xl font-serif italic">
          JoyAlure<span className="text-green-500">.</span>
        </div>
      </div>

      <div className="absolute bottom-6 lg:bottom-10 left-6 lg:left-10 text-[8px] md:text-[9px] tracking-[0.2em] text-white/30 uppercase">
        © {new Date().getFullYear()} JoyAlure Studio
      </div>

      {/* COOL SUCCESS POPUP */}
      <AnimatePresence>
        {isSuccessOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-12 text-center relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-green-500" />
              
              <div className="mb-6 flex justify-center">
                <div className="w-12 h-12 rounded-full border border-green-500 flex items-center justify-center text-green-500">
                  <motion.svg 
                    initial={{ pathLength: 0 }} 
                    animate={{ pathLength: 1 }} 
                    transition={{ duration: 0.6, delay: 0.2 }}
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-serif mb-4 text-white">You're on the list.</h3>
              <p className="text-gray-400 text-sm font-light mb-8 leading-relaxed">
                Thank you for joining JoyAlure. We'll notify you as soon as we launch our premium collection.
              </p>

              <button 
                onClick={() => setIsSuccessOpen(false)}
                className="px-8 py-3 border border-white/20 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white hover:text-black transition-all"
              >
                Return
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DUPLICATE/ALREADY ON LIST POPUP */}
      <AnimatePresence>
        {isDuplicateOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-12 text-center relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-yellow-500" />
              
              <div className="mb-6 flex justify-center">
                <div className="w-12 h-12 rounded-full border border-yellow-500 flex items-center justify-center text-yellow-500 font-serif italic text-2xl">
                  !
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-serif mb-4 text-white">We've met before!</h3>
              <p className="text-gray-400 text-sm font-light mb-8 leading-relaxed">
                This email is already registered for our launch notification. Stay tuned for updates in your inbox!
              </p>

              <button 
                onClick={() => setIsDuplicateOpen(false)}
                className="px-8 py-3 border border-white/20 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white hover:text-black transition-all"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col lg:flex-row"
          >
            <div className="flex-1 p-8 md:p-24 flex flex-col justify-center relative">
              <button 
                onClick={() => setShowInfo(false)}
                className="absolute top-8 lg:top-12 right-8 lg:right-12 text-[10px] tracking-[0.3em] font-bold uppercase hover:text-green-500 transition-colors"
              >
                [ X Close ]
              </button>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
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
                    <p className="text-base md:text-lg">Fort Worth,Texas, United States</p>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="hidden lg:block lg:w-1/4 bg-green-500/5 border-l border-white/5" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}