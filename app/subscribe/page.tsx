"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Mail, Gift, Bell, Sparkles, Check } from "lucide-react"

export default function SubscribePage() {
  const [email, setEmail] = useState("")
  const [preferences, setPreferences] = useState({
    newProducts: true,
    exclusiveOffers: true,
    beautyTips: true,
    events: false
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to backend
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setEmail("")
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/30 to-green-100/50 dark:from-zinc-950 dark:via-zinc-900/50 dark:to-zinc-900">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 text-white py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto px-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Subscribe to Joyalure
          </h1>
          <p className="text-green-100 text-lg animate-fade-in-delay">
            Get exclusive offers, beauty tips, and be the first to know about new products
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <Gift className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-zinc-100 mb-2">Exclusive Offers</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Get access to subscriber-only discounts and promotions
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-zinc-100 mb-2">Early Access</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Be the first to shop new product launches
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-zinc-100 mb-2">Beauty Tips</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Receive expert skincare advice and tutorials
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-zinc-100 mb-2">Curated Content</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Get personalized product recommendations
            </p>
          </div>
        </div>

        {/* Subscription Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 overflow-hidden animate-slide-up">
          <div className="p-8 md:p-12">
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
                  <label htmlFor="email" className="block text-xl font-bold text-gray-900 dark:text-zinc-100">
                    Enter your email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:border-green-500 dark:focus:border-green-500 focus:outline-none transition-colors text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">
                    What would you like to receive?
                  </h3>
                  
                  <div className="space-y-3">
                    {[
                      { key: 'newProducts', label: 'New Product Announcements', description: 'Be the first to discover our latest launches' },
                      { key: 'exclusiveOffers', label: 'Exclusive Offers & Discounts', description: 'Special deals just for subscribers' },
                      { key: 'beautyTips', label: 'Beauty Tips & Tutorials', description: 'Expert skincare advice and how-tos' },
                      { key: 'events', label: 'Events & Workshops', description: 'Invites to special events and workshops' }
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-start gap-4 p-4 rounded-lg border-2 border-gray-200 dark:border-zinc-700 cursor-pointer hover:bg-green-50/50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={preferences[item.key as keyof typeof preferences]}
                          onChange={() => setPreferences(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof preferences] }))}
                          className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-zinc-100">{item.label}</div>
                          <div className="text-sm text-gray-600 dark:text-zinc-400">{item.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-green-600 hover:bg-green-700 dark:hover:bg-green-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                  >
                    Subscribe Now
                  </button>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 text-center mt-4">
                    By subscribing, you agree to our{" "}
                    <Link href="/privacy-policy" className="text-green-600 dark:text-green-400 hover:underline">
                      Privacy Policy
                    </Link>
                    . You can unsubscribe at any time.
                  </p>
                </div>

              </form>
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-4">
                  Welcome to Joyalure!
                </h2>
                <p className="text-gray-700 dark:text-zinc-300 text-lg">
                  Thank you for subscribing. Check your email for a special welcome offer!
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 rounded-2xl p-8 md:p-12 text-white opacity-0 animate-fade-in-up" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
          <h2 className="text-2xl font-bold mb-4">Why Subscribe?</h2>
          <div className="grid md:grid-cols-2 gap-6 text-green-100">
            <div className="flex gap-3">
              <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Save up to 20%</strong> with subscriber-exclusive discounts
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Free samples</strong> with your first order
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Early access</strong> to limited edition products
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Personalized</strong> skincare recommendations
              </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 0.3s both;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .bg-grid-pattern {
          background-image: linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  )
}
