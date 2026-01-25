import React from "react";
import CloseButton from "./CloseButton";

interface InfoPanelProps {
  show: boolean;
  onClose: () => void;
}

export default function InfoPanel({ show, onClose }: InfoPanelProps) {
  return (
    <div
      className={`absolute inset-0 z-20 bg-black/95 flex transition-transform duration-700 ease-in-out ${show ? 'translate-x-0' : 'translate-x-full pointer-events-none'}`}
      style={{ willChange: 'transform' }}
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-2 h-full">
        {/* Left: Text */}
        <div className="p-10 flex flex-col justify-center">
          <CloseButton onClick={onClose} className="mb-6" />
          <h1 className="text-4xl font-serif mb-6 text-green-400">We are Joy Allure. Pure Body Beauty.</h1>
          <p className="text-green-300 max-w-2xl mb-6">
            Joy Allure is a beauty brand specializing in body products—nothing else. Our mission is to provide you with the finest body care essentials, crafted for luxury and wellness. We are building a platform to bring our exclusive body care range and expertise closer to you.
          </p>
          <p className="text-green-400 max-w-2xl">
            Our upcoming website will feature our full line of body products, expert tips, and exclusive offers. Join our newsletter to be the first to know when we launch.
          </p>
          <h2 className="text-3xl md:text-6xl font-serif leading-tight mb-6 text-green-400">
            We are currently working on<br />
            a new website for your body care journey.
          </h2>
        </div>
        {/* Right: Address, contact, socials */}
        <div className="p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-green-400 mb-2">Start A Conversation</h3>
            <p>
              hello@joyallure.com<br />
              +212 600 000 000
            </p>
          </div>
          <div className="mb-8">
            <h3 className="text-green-400 mb-2">Visit Our Office</h3>
            <p>
              Fes, Morocco<br />
              Joy Allure Studio
            </p>
          </div>
          <div>
            <h3 className="text-green-400 mb-2">Find Us On</h3>
            <div className="flex gap-6 text-green-400 text-2xl mt-2">
              <a href="#" aria-label="Facebook" className="hover:text-green-600"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter" className="hover:text-green-600"><i className="fa-brands fa-twitter"></i></a>
              <a href="#" aria-label="Instagram" className="hover:text-green-600"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="Behance" className="hover:text-green-600"><i className="fa-brands fa-behance"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
