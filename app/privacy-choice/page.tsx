"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Shield, Cookie, Bell, Eye, Mail } from "lucide-react"

export default function PrivacyChoicePage() {
  const [preferences, setPreferences] = useState({
    analytics: true,
    marketing: false,
    personalization: true,
    thirdParty: false
  })

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    // In a real app, this would save to backend
    alert("Your privacy preferences have been saved!")
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
            Your Privacy Choices
          </h1>
          <p className="text-green-100 text-lg animate-fade-in-delay">
            Manage how we collect and use your information
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 overflow-hidden animate-slide-up">
          <div className="p-8 md:p-12 space-y-8">
            
            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <Shield className="w-7 h-7 text-green-600 dark:text-green-400" />
                Privacy Controls
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                At Joyalure, we respect your privacy and give you control over how your data is used. Use the toggles below to manage your preferences.
              </p>
            </section>

            {/* Privacy Toggles */}
            <div className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              
              {/* Analytics Cookies */}
              <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 transition-all hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Cookie className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <h3 className="font-bold text-gray-900 dark:text-zinc-100">Analytics Cookies</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      Help us understand how visitors interact with our website to improve user experience.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('analytics')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.analytics 
                        ? 'bg-green-600' 
                        : 'bg-gray-300 dark:bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Marketing Communications */}
              <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 transition-all hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <h3 className="font-bold text-gray-900 dark:text-zinc-100">Marketing Communications</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      Receive promotional emails, exclusive offers, and product updates from Joyalure.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('marketing')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.marketing 
                        ? 'bg-green-600' 
                        : 'bg-gray-300 dark:bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Personalization */}
              <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 transition-all hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <h3 className="font-bold text-gray-900 dark:text-zinc-100">Personalization</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      Allow us to personalize your shopping experience based on your preferences and browsing history.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('personalization')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.personalization 
                        ? 'bg-green-600' 
                        : 'bg-gray-300 dark:bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.personalization ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Third-Party Sharing */}
              <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 transition-all hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <h3 className="font-bold text-gray-900 dark:text-zinc-100">Third-Party Sharing</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      Allow sharing of your information with trusted partners for relevant offers and services.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('thirdParty')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.thirdParty 
                        ? 'bg-green-600' 
                        : 'bg-gray-300 dark:bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.thirdParty ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

            </div>

            {/* Save Button */}
            <div className="flex justify-center pt-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 dark:hover:bg-green-500 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Save Preferences
              </button>
            </div>

            <section className="space-y-4 opacity-0 animate-fade-in-up border-t border-gray-200 dark:border-zinc-800 pt-8" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Your Rights
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-zinc-300">
                <p className="leading-relaxed">Under privacy laws, you have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access the personal data we hold about you</li>
                  <li>Request correction of any inaccurate data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to processing of your personal data</li>
                  <li>Request restriction of processing your data</li>
                  <li>Data portability (receive your data in a structured format)</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Do Not Sell My Personal Information
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                Joyalure does not sell your personal information to third parties. If you have any concerns about how your data is being used, please contact our privacy team.
              </p>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Contact Privacy Team
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                To exercise your privacy rights or for any privacy-related questions:
              </p>
              <div className="bg-green-50 dark:bg-zinc-800 p-6 rounded-lg border border-green-200 dark:border-zinc-700">
                <p className="text-gray-900 dark:text-zinc-100 font-medium">Privacy Department</p>
                <p className="text-green-700 dark:text-green-400 mt-2">privacy@joyalure.com</p>
                <p className="text-gray-700 dark:text-zinc-300 mt-1">Response time: 1-2 business days</p>
              </div>
            </section>

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
