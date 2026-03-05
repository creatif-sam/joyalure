"use client"

import Link from "next/link"
import { ChevronLeft, Truck, Globe, Clock, MapPin } from "lucide-react"

export default function ShippingPolicyPage() {
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
            Shipping Policy
          </h1>
          <p className="text-green-100 text-lg animate-fade-in-delay">
            Fast, reliable delivery to your door
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 overflow-hidden animate-slide-up">
          <div className="p-8 md:p-12 space-y-8">
            
            {/* Quick Info Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-green-50 dark:bg-zinc-800 p-6 rounded-xl border border-green-200 dark:border-zinc-700 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
                <Truck className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-sm">Free Shipping</h3>
                <p className="text-xs text-gray-600 dark:text-zinc-400 mt-2">Orders over $50</p>
              </div>
              
              <div className="bg-green-50 dark:bg-zinc-800 p-6 rounded-xl border border-green-200 dark:border-zinc-700 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                <Clock className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-sm">Fast Processing</h3>
                <p className="text-xs text-gray-600 dark:text-zinc-400 mt-2">Ships within 24-48h</p>
              </div>
              
              <div className="bg-green-50 dark:bg-zinc-800 p-6 rounded-xl border border-green-200 dark:border-zinc-700 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
                <Globe className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-sm">Global Reach</h3>
                <p className="text-xs text-gray-600 dark:text-zinc-400 mt-2">Worldwide shipping</p>
              </div>
              
              <div className="bg-green-50 dark:bg-zinc-800 p-6 rounded-xl border border-green-200 dark:border-zinc-700 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
                <MapPin className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-sm">Track Orders</h3>
                <p className="text-xs text-gray-600 dark:text-zinc-400 mt-2">Real-time tracking</p>
              </div>
            </div>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Processing Time
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive a shipping confirmation with tracking information once your order has shipped.
              </p>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Domestic Shipping (USA)
              </h2>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-green-50 dark:bg-zinc-800 border-b border-green-200 dark:border-zinc-700">
                        <th className="text-left p-4 text-gray-900 dark:text-zinc-100 font-semibold">Shipping Method</th>
                        <th className="text-left p-4 text-gray-900 dark:text-zinc-100 font-semibold">Delivery Time</th>
                        <th className="text-left p-4 text-gray-900 dark:text-zinc-100 font-semibold">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-zinc-300">
                      <tr className="border-b border-gray-200 dark:border-zinc-800">
                        <td className="p-4">Standard Shipping</td>
                        <td className="p-4">5-7 business days</td>
                        <td className="p-4">$5.99</td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-zinc-800">
                        <td className="p-4">Express Shipping</td>
                        <td className="p-4">2-3 business days</td>
                        <td className="p-4">$12.99</td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-zinc-800">
                        <td className="p-4">Overnight Shipping</td>
                        <td className="p-4">1 business day</td>
                        <td className="p-4">$24.99</td>
                      </tr>
                      <tr className="bg-green-50/50 dark:bg-zinc-800/50">
                        <td className="p-4 font-semibold text-green-700 dark:text-green-400">Free Standard Shipping</td>
                        <td className="p-4">5-7 business days</td>
                        <td className="p-4 font-semibold text-green-700 dark:text-green-400">Orders $50+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                International Shipping
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-zinc-300">
                <p className="leading-relaxed">
                  We ship to select countries worldwide. International shipping times and costs vary by destination:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Canada:</strong> 7-14 business days, starting at $15</li>
                  <li><strong>United Kingdom & Europe:</strong> 10-21 business days, starting at $20</li>
                  <li><strong>Australia & New Zealand:</strong> 14-28 business days, starting at $25</li>
                  <li><strong>Asia:</strong> 14-28 business days, starting at $25</li>
                </ul>
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Note:</strong> International orders may be subject to import duties, taxes, and customs fees. These charges are the responsibility of the recipient and are not included in your order total.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Order Tracking
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                Once your order ships, you will receive a shipping confirmation email with a tracking number. You can track your package through the carrier&apos;s website or in your Joyalure account under &quot;Order History.&quot;
              </p>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Shipping Restrictions
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-zinc-300">
                <p className="leading-relaxed">Please note the following restrictions:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We currently do not ship to P.O. Boxes for express or overnight delivery</li>
                  <li>Some products may have shipping restrictions to certain locations</li>
                  <li>Weather conditions may delay delivery in some areas</li>
                  <li>Signature may be required for high-value orders</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "1s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Lost or Damaged Packages
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                If your package is lost in transit or arrives damaged, please contact our customer service team within 48 hours of the expected delivery date. We will work with the carrier to resolve the issue and ensure you receive your order.
              </p>
            </section>

            <section className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "1.1s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                Questions About Shipping?
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                For shipping inquiries, please contact us:
              </p>
              <div className="bg-green-50 dark:bg-zinc-800 p-6 rounded-lg border border-green-200 dark:border-zinc-700">
                <p className="text-gray-900 dark:text-zinc-100 font-medium">Shipping Support</p>
                <p className="text-green-700 dark:text-green-400 mt-2">shipping@joyalure.com</p>
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
