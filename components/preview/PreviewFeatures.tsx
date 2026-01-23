"use client"

import { useSettings } from "@/lib/settings-context"

export function PreviewFeatures() {
  const { settings } = useSettings()

  return (
    <div className="space-y-12">
      {/* Features Section */}
      {settings.featuresEnabled && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
              <p className="text-lg text-gray-600">What makes our products special</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {settings.feature1Title}
                </h3>
                <p className="text-gray-600">
                  {settings.feature1Description}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚕️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {settings.feature2Title}
                </h3>
                <p className="text-gray-600">
                  {settings.feature2Description}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {settings.feature3Title}
                </h3>
                <p className="text-gray-600">
                  {settings.feature3Description}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Preview */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 mb-12">
            Featured Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group relative">
                <div className="relative overflow-hidden bg-gray-100 rounded-lg">
                  <div className="w-full h-72 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">Product Image</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-800 font-medium">
                    Sample Product {i}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-semibold">
                      $29.99
                    </span>
                    <button className="bg-black text-white px-3 py-1 rounded text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers Preview */}
      <section className="bg-gray-50 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 mb-12">
            Special Offers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-80 bg-gradient-to-r from-pink-400 to-red-400 rounded-2xl overflow-hidden flex items-center justify-center text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">20% OFF</h3>
                <p className="text-lg mb-4">All Skincare Products</p>
                <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm">
                  Limited Time Offer
                </span>
              </div>
            </div>

            <div className="relative h-80 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl overflow-hidden flex items-center justify-center text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Buy 2 Get 1 Free</h3>
                <p className="text-lg mb-4">Selected Items</p>
                <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm">
                  While Supplies Last
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 mb-12 text-center">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  &ldquo;Amazing products! My skin has never looked better. Highly recommend!&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900">Customer {i}</p>
                    <p className="text-sm text-gray-500">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}