"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-green-100 text-lg animate-fade-in-delay">
            Last updated: February 21, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 overflow-hidden animate-slide-up">
          <div className="p-8 md:p-12 space-y-8">
            
            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Introduction
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                At Joyalure, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from our store.
              </p>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Information We Collect
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-zinc-300">
                <p className="leading-relaxed">We collect information that you provide directly to us, including:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name and contact information (email, phone, address)</li>
                  <li>Payment information (processed securely through our payment providers)</li>
                  <li>Order history and preferences</li>
                  <li>Account credentials</li>
                  <li>Communications with our customer service team</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                How We Use Your Information
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-zinc-300">
                <p className="leading-relaxed">We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Process and fulfill your orders</li>
                  <li>Send you order confirmations and shipping updates</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Improve our products and services</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Detect and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Information Sharing
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                We do not sell or rent your personal information to third parties. We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700 dark:text-zinc-300">
                <li>Service providers who assist with order fulfillment, payment processing, and shipping</li>
                <li>Analytics providers to help us understand how our site is used</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Cookies and Tracking
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                We use cookies and similar tracking technologies to improve your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Your Rights
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-zinc-300">
                <p className="leading-relaxed">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Object to processing of your information</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Data Security
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Contact Us
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-green-50 dark:bg-zinc-800 p-6 rounded-lg border border-green-200 dark:border-zinc-700">
                <p className="text-gray-900 dark:text-zinc-100 font-medium">Joyalure</p>
                <p className="text-gray-700 dark:text-zinc-300">Chez Joy Gyamfi</p>
                <p className="text-gray-700 dark:text-zinc-300">Fort Worth, Texas, United States</p>
                <p className="text-green-700 dark:text-green-400 mt-2">support@joyalure.com</p>
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
