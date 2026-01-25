import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-white via-green-50 to-green-100 border-t border-gray-200 text-gray-700">
      
      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-green-200/40 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wide">
            Company
          </h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/about" className="hover:text-green-700 transition">About Us</Link></li>
            <li><Link href="/subscribe" className="hover:text-green-700 transition">Subscribe Us</Link></li>
            <li><Link href="/contact" className="hover:text-green-700 transition">Contact Us</Link></li>
            <li><Link href="/adverse-events" className="hover:text-green-700 transition">Adverse events</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wide">
            Shop
          </h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/products" className="hover:text-green-700 transition">All</Link></li>
            <li><Link href="/products?filter=bestsellers" className="hover:text-green-700 transition">Bestsellers</Link></li>
            <li><Link href="/products?filter=category" className="hover:text-green-700 transition">By Category</Link></li>
            <li><Link href="/products?filter=concern" className="hover:text-green-700 transition">By Skin Concern</Link></li>
            <li><Link href="/products?filter=ingredients" className="hover:text-green-700 transition">By Ingredients</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wide">
            Customer Care
          </h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/faq" className="hover:text-green-700 transition">FAQ</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-green-700 transition">Shipping Policy</Link></li>
            <li><Link href="/return-policy" className="hover:text-green-700 transition">Return Policy</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-green-700 transition">Privacy Policy</Link></li>
            <li><Link href="/privacy-choice" className="hover:text-green-700 transition">Your Privacy Choice</Link></li>
            <li><Link href="/terms" className="hover:text-green-700 transition">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-900">Joyalure.</p>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">
              Chez Joy Gyamfi<br />
              Yes Tik, Texas<br />
              United States
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
          >
            <span className="text-lg">♡</span>
            Follow on Shop
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Address and copyright on the left */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 text-xs text-gray-500 md:order-1 order-2">
            <span>Chez Joy Gyamfi, Yes Tik, Texas, United States</span>
            <span className="hidden md:inline mx-2">|</span>
            <span>© 2026 Joyalure. All rights reserved.</span>
          </div>
          {/* Animated social icons on the right */}
          <div className="flex gap-6 text-gray-600 text-lg md:order-2 order-1">
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
        </div>
      </div>
    </footer>
  )
}
