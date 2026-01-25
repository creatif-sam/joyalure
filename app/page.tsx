"use client";
import { useEffect, useState } from "react";
import CloseButton from "../components/CloseButton";
import InfoPanel from "../components/InfoPanel";

export default function JoyAllureComingSoon() {
  // Typing animation for 'WELCOME TO JOY ALLURE'
  const welcomeText = "WELCOME TO JOY ALLURE";
  const [typedWelcome, setTypedWelcome] = useState("");
  useEffect(() => {
    let i = 0;
    let forward = true;
    let timeout: NodeJS.Timeout;
    function typeLoop() {
      if (forward) {
        setTypedWelcome(welcomeText.slice(0, i + 1));
        if (i < welcomeText.length) {
          i++;
          timeout = setTimeout(typeLoop, 80);
        } else {
          forward = false;
          timeout = setTimeout(typeLoop, 1200);
        }
      } else {
        setTypedWelcome(welcomeText.slice(0, i - 1));
        if (i > 0) {
          i--;
          timeout = setTimeout(typeLoop, 40);
        } else {
          forward = true;
          timeout = setTimeout(typeLoop, 400);
        }
      }
    }
    typeLoop();
    return () => clearTimeout(timeout);
  }, []);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [slideIndex, setSlideIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const slides = [
    "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1600&q=80",
  ];

  useEffect(() => {
    // 21 days from now
    const now = new Date();
    const launchDate = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000).getTime();
    const interval = setInterval(() => {
      const nowTime = new Date().getTime();
      const diff = launchDate - nowTime;
      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    const slideTimer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => {
      clearInterval(interval);
      clearInterval(slideTimer);
    };
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus("Please enter a valid email.");
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("Thank you for subscribing.");
        setEmail("");
      } else {
        setStatus("Subscription failed. Try again later.");
      }
    } catch {
      setStatus("Network error. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans">
      <style jsx>{`
        .bg-image {
          background-size: cover;
          background-position: center;
          transition: opacity 1.5s ease-in-out;
        }
      `}</style>

      {slides.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-image"
          style={{
            backgroundImage: `url(${src})`,
            opacity: slideIndex === i ? 0.35 : 0,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 min-h-screen">
        {/* Timer: 1/3 */}
        <div className="col-span-1 flex flex-col justify-center items-center min-h-[50vh] p-10">
          <div className="flex flex-col justify-center w-full h-full">
            <div className="flex flex-col w-full max-w-xs mx-auto">
              <span className="tracking-widest text-2xl md:text-3xl text-white mb-1 text-left">LAUNCHING IN</span>
              <div className="flex items-end space-x-4 w-full">
                <div className="text-[5rem] md:text-[7rem] font-extrabold text-white leading-none text-left w-32 md:w-44">{String(timeLeft.days).padStart(2, "0")}</div>
                <div className="bg-white text-green-700 text-lg md:text-2xl font-bold px-4 py-1.5 rounded mb-4">day</div>
              </div>
              <div className="flex space-x-8 text-2xl md:text-4xl tracking-wider text-white font-bold mt-0 w-full">
                <div className="flex items-end">
                  <span>{String(timeLeft.hours).padStart(2, "0")}</span>
                  <span className="text-xs md:text-lg text-white ml-1 mb-1 md:mb-2">h</span>
                </div>
                <div className="flex items-end">
                  <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
                  <span className="text-xs md:text-lg text-white ml-1 mb-1 md:mb-2">m</span>
                </div>
                <div className="flex items-end">
                  <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
                  <span className="text-xs md:text-lg text-white ml-1 mb-1 md:mb-2">s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text: 2/3 */}
        <div className="col-span-1 md:col-span-2 p-10 flex flex-col justify-center">
          <p className="tracking-widest text-sm text-green-400 mb-4 min-h-[1.5em]">
            <span>{typedWelcome}</span>
            <span className="animate-pulse">|</span>
          </p>
          <h2 className="text-3xl md:text-6xl font-serif leading-tight mb-6 text-green-400">
            We are currently working on a new website for your body care journey.
          </h2>
          <p className="text-green-200 max-w-xl">
            Joy Allure is a beauty brand dedicated exclusively to body products. We are preparing a luxurious digital experience to help you discover, shop, and enjoy our premium body care range. Stay tuned for something beautiful, just for your body.
          </p>

          <form onSubmit={handleSubscribe} className="mt-8 flex max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="flex-1 px-4 py-3 rounded-l bg-black/60 border border-green-400 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-r bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Notify Me
            </button>
          </form>
          {status && <p className="mt-3 text-sm text-green-400">{status}</p>}
        </div>

        <button
          onClick={() => setShowInfo(true)}
          className="absolute top-4 left-4 flex items-center gap-1 group"
          style={{ zIndex: 40 }}
        >
          {/* Custom burger icon box, even smaller */}
          <span className="flex items-center justify-center w-7 h-7 border border-white bg-black/80 mr-1 rounded-md" style={{ minWidth: '28px', minHeight: '28px' }}>
            <span className="flex flex-col justify-center items-center w-4 h-4">
              <span className="block w-4 h-0.5 mb-0.5" style={{ background: '#fff' }}></span>
              <span className="block w-4 h-0.5 mb-0.5" style={{ background: '#fff' }}></span>
              <span className="block w-4 h-0.5" style={{ background: '#fff' }}></span>
            </span>
          </span>
          <span className="text-white tracking-[0.15em] text-xs font-medium group-hover:text-gray-300 transition-colors">MORE INFO</span>
        </button>
        <div className="absolute top-6 right-6 text-2xl font-bold text-green-400">Joy Allure</div>

        {/* Animated social icons (footer style) */}
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-6 text-gray-600 text-2xl z-30">
          <a
            href="#"
            aria-label="Facebook"
            className="transition transform hover:text-green-700 hover:-translate-y-1 hover:scale-110"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-facebook-f"></i>
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="transition transform hover:text-green-700 hover:-translate-y-1 hover:scale-110"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a
            href="#"
            aria-label="TikTok"
            className="transition transform hover:text-green-700 hover:-translate-y-1 hover:scale-110"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-tiktok"></i>
          </a>
        </div>

        <div className="absolute bottom-6 left-10 text-xs text-green-300">
          © {new Date().getFullYear()} Joy Allure. All rights reserved.
        </div>
      </div>

      <div
        className={`absolute inset-0 z-20 bg-black/95 flex transition-transform duration-700 ease-in-out ${showInfo ? 'translate-x-0' : 'translate-x-full pointer-events-none'}`}
        style={{ willChange: 'transform' }}
      >
        <div className="flex-1 p-10">
          <CloseButton onClick={() => setShowInfo(false)} className="mb-6" />
          <h1 className="text-4xl font-serif mb-6 text-green-400">We are Joy Allure. Pure Body Beauty.</h1>
          <p className="text-green-300 max-w-2xl mb-6">
            Joy Allure is a beauty brand specializing in body products—nothing else. Our mission is to provide you with the finest body care essentials, crafted for luxury and wellness. We are building a platform to bring our exclusive body care range and expertise closer to you.
          </p>
          <p className="text-green-400 max-w-2xl">
            Our upcoming website will feature our full line of body products, expert tips, and exclusive offers. Join our newsletter to be the first to know when we launch.
          </p>
        
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
              Texas, United States<br />
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
