"use client";
import { motion, AnimatePresence, Variants } from "framer-motion";

const slideVariants: Variants = {
  initial: { opacity: 0, scale: 1.1 },
  animate: { opacity: 0.35, scale: 1, transition: { duration: 2.5, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 1.5 } }
};

export default function BackgroundSlider({ slides, currentIndex }: { slides: string[], currentIndex: number }) {
  return (
    <div className="absolute inset-0 z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slides[currentIndex]})` }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-black via-black/60 to-transparent" />
    </div>
  );
}