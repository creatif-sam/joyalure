"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingBag, Heart, ArrowLeft, Check, Star } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { useShopStore } from "@/lib/shop-store"
import { useCurrencyStore } from "@/lib/currency-store"
import { toast } from "sonner"

type Product = {
  id: string
  handle: string
  title: string
  description: string
  price: number
  image_url: string | null
  is_featured: boolean
  is_recent: boolean
  category: { name: string } | null
  variantId: string
  availableForSale: boolean
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const { wishlist, toggleWishlist } = useShopStore()
  const { currency, rate } = useCurrencyStore()

  const isWishlisted = wishlist?.some((item) => item.id === product.id)
  const convertedPrice = currency === "USD" ? product.price / 100 : (product.price / 100) * rate
  const currencySymbol = currency === "USD" ? "$" : "₵"

  const handleAddToCart = () => {
    addItem({ ...product, quantity: 1 })
    toast.success(`${product.title} added to cart`)
    openCart()
  }

  const handleToggleWishlist = () => {
    toggleWishlist(product)
    if (!isWishlisted) {
      toast.success("Added to favorites")
    } else {
      toast("Removed from favorites")
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-500 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      </div>

      {/* Product Detail */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* LEFT: Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="sticky top-24">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-900">
                <Image
                  src={product.image_url || "/placeholder.png"}
                  alt={product.title}
                  fill
                  priority
                  className={`object-cover transition-all duration-700 ${
                    imageLoaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {product.is_featured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider shadow-lg">
                      Featured
                    </span>
                  </div>
                )}
                {product.is_recent && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider shadow-lg">
                      New
                    </span>
                  </div>
                )}
              </div>

              {/* Product Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-8 grid grid-cols-3 gap-4"
              >
                {[
                  { icon: "🌿", label: "Organic" },
                  { icon: "🐰", label: "Cruelty Free" },
                  { icon: "♻️", label: "Sustainable" },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4 text-center border border-gray-100 dark:border-zinc-800"
                  >
                    <div className="text-2xl mb-1">{feature.icon}</div>
                    <p className="text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide">
                      {feature.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Category */}
            {product.category?.name && (
              <div className="inline-block">
                <span className="text-xs font-black text-green-600 dark:text-green-500 uppercase tracking-widest">
                  {product.category.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900 dark:text-zinc-100 leading-tight">
              {product.title}
            </h1>

            {/* Rating (Static for now) */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-zinc-400">(4.0)</span>
            </div>

            {/* Price */}
            <div className="py-4 border-y border-gray-200 dark:border-zinc-800">
              <p className="text-3xl font-black text-gray-900 dark:text-zinc-100 italic">
                {currencySymbol}
                {convertedPrice.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                Includes taxes and shipping calculated at checkout
              </p>
            </div>

            {/* Description */}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                {product.description || "Experience premium skincare crafted with natural ingredients for radiant, healthy skin."}
              </p>
            </div>

            {/* Key Benefits */}
            <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 border border-gray-100 dark:border-zinc-800">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-zinc-100 mb-4">
                Key Benefits
              </h3>
              <ul className="space-y-3">
                {[
                  "Nourishes and hydrates deeply",
                  "Clinically tested formula",
                  "Suitable for all skin types",
                  "Visible results in 2-4 weeks",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={16} className="text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-zinc-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.availableForSale}
                className="flex-1 flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-md transition-all active:scale-[0.98] shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={20} />
                {product.availableForSale ? "Add to Cart" : "Out of Stock"}
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`p-4 border-2 rounded-md transition-all active:scale-95 ${
                  isWishlisted
                    ? "bg-red-50 dark:bg-red-950/20 border-red-500 text-red-500"
                    : "border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-red-500 hover:text-red-500"
                }`}
              >
                <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800">
                <div className="text-2xl">🔒</div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-zinc-100">Secure Checkout</p>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-400">SSL Encrypted</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800">
                <div className="text-2xl">🚚</div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-zinc-100">Free Shipping</p>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-400">On orders $50+</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
