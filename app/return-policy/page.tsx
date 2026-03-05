"use client"

import Link from "next/link"
import { ChevronLeft, Package, RefreshCw, CheckCircle } from "lucide-react"

export default function ReturnPolicyPage() {
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
            Return Policy
          </h1>
          <p className="text-green-100 text-lg animate-fade-in-delay">
            Your satisfaction is our priority
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 overflow-hidden animate-slide-up">
          <div className="p-8 md:p-12 space-y-8">
            
            {/* Quick Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 dark:bg-zinc-800 p-6 rounded-xl border border-green-200 dark:border-zinc-700 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
                <RefreshCw className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-zinc-100">30-Day Returns</h3>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2">Full refund within 30 days</p>
              </div>
              
              <div className="bg-green-50 dark:bg-zinc-800 p-6 rounded-xl border border-green-200 dark:border-zinc-700 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                <Package className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-zinc-100">Free Returns</h3>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2">We cover return shipping</p>
              </div>
              
              <div className="bg-green-50 dark:bg-zinc-800 p-6 rounded-xl border border-green-200 dark:border-zinc-700 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-zinc-100">Easy Process</h3>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2">Simple return steps</p>
              </div>
            </div>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Return Window
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                We offer a 30-day return policy from the date you receive your order. If 30 days have passed since your delivery, unfortunately we cannot offer you a refund or exchange.
              </p>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Eligible Items
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-zinc-300">
                <p className="leading-relaxed">To be eligible for a return, your item must be:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Unused and in the same condition that you received it</li>
                  <li>In the original packaging with all seals intact</li>
                  <li>Accompanied by proof of purchase or receipt</li>
                  <li>Not a final sale, clearance, or promotional item (unless defective)</li>
                </ul>
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Note:</strong> For hygiene and safety reasons, opened skincare products cannot be returned unless defective or damaged upon arrival.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                How to Initiate a Return
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-zinc-300">
                <p className="leading-relaxed">Follow these simple steps:</p>
                <ol className="list-decimal list-inside space-y-3 ml-4">
                  <li>Contact our customer service team at returns@joyalure.com or through your account</li>
                  <li>Provide your order number and reason for return</li>
                  <li>Receive your prepaid return shipping label via email</li>
                  <li>Pack your items securely in the original packaging</li>
                  <li>Attach the return label and drop off at any authorized shipping location</li>
                  <li>Track your return shipment using the provided tracking number</li>
                </ol>
              </div>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Refund Processing
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                Once we receive your return, our team will inspect the items and process your refund within 5-7 business days. Your refund will be credited to your original payment method. Please note that depending on your financial institution, it may take an additional 5-10 business days for the refund to appear in your account.
              </p>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Exchanges
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                We currently replace items only if they are defective or damaged. If you need to exchange a product for the same item, contact us at returns@joyalure.com and we&apos;ll guide you through the process.
              </p>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Damaged or Defective Items
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                If you receive a damaged or defective product, please contact us immediately with photos of the damage. We will arrange for a replacement or full refund, including any shipping charges. Your satisfaction is our priority.
              </p>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "1s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Questions?
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                If you have any questions about our return policy, please don&apos;t hesitate to contact us:
              </p>
              <div className="bg-green-50 dark:bg-zinc-800 p-6 rounded-lg border border-green-200 dark:border-zinc-700">
                <p className="text-gray-900 dark:text-zinc-100 font-medium">Customer Service</p>
                <p className="text-green-700 dark:text-green-400 mt-2">returns@joyalure.com</p>
                <p className="text-gray-700 dark:text-zinc-300 mt-1">Monday - Friday: 9 AM - 6 PM EST</p>
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
