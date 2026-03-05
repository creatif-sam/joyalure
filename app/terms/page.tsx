"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function TermsPage() {
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
            Terms of Service
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
                Agreement to Terms
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                By accessing or using Joyalure&apos;s website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Use of Our Services
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-zinc-300">
                <p className="leading-relaxed">You agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and complete information when creating an account</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access to your account</li>
                  <li>Use our services only for lawful purposes</li>
                  <li>Not engage in any activity that disrupts or interferes with our services</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Products and Pricing
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-zinc-300">
                <p className="leading-relaxed">
                  We make every effort to display our products and pricing accurately. However:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Product images are for illustrative purposes and may vary slightly from actual products</li>
                  <li>We reserve the right to correct pricing errors</li>
                  <li>All prices are in USD unless otherwise stated</li>
                  <li>Prices are subject to change without notice</li>
                  <li>We reserve the right to limit quantities and refuse orders</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Orders and Payment
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                By placing an order, you are making an offer to purchase our products. We reserve the right to accept or reject any order. Payment must be received before orders are processed. We accept major credit cards and other payment methods as indicated on our site.
              </p>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Intellectual Property
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                All content on this website, including text, graphics, logos, images, and software, is the property of Joyalure and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Product Usage and Safety
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-zinc-300">
                <p className="leading-relaxed">When using our skincare products:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Follow all usage instructions provided</li>
                  <li>Perform a patch test before first use</li>
                  <li>Discontinue use if irritation occurs</li>
                  <li>Consult a healthcare professional if you have concerns</li>
                  <li>Keep products out of reach of children</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Limitation of Liability
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                To the fullest extent permitted by law, Joyalure shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our products or services. Our total liability shall not exceed the amount you paid for the product or service.
              </p>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Modifications to Terms
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the website. Your continued use of our services after changes are posted constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Governing Law
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "1s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Contact Information
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-green-50 dark:bg-zinc-800 p-6 rounded-lg border border-green-200 dark:border-zinc-700">
                <p className="text-gray-900 dark:text-zinc-100 font-medium">Joyalure</p>
                <p className="text-gray-700 dark:text-zinc-300">Chez Joy Gyamfi</p>
                <p className="text-gray-700 dark:text-zinc-300">Fort Worth, Texas, United States</p>
                <p className="text-green-700 dark:text-green-400 mt-2">legal@joyalure.com</p>
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
