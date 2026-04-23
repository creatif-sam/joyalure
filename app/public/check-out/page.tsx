"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useCartStore } from "@/lib/cart-store"
import { useCurrencyStore } from "@/lib/currency-store"
import { useAnalytics } from "@/hooks/use-analytics"
import { toast } from "sonner"
import Image from "next/image"
import { ShieldCheck, ShoppingBag } from "lucide-react"

export default function CheckoutPage() {
  const { items, subtotal, checkout, isCheckingOut } = useCartStore()
  const { currency, rate } = useCurrencyStore()
  const { trackCheckoutStart, trackClick } = useAnalytics()

  useEffect(() => {
    trackCheckoutStart()
  }, [trackCheckoutStart])

  const symbol = currency === "USD" ? "$" : "₵"

  const formatAmount = (priceInCents: number) => {
    const amount = currency === "USD"
      ? priceInCents / 100
      : (priceInCents / 100) * rate
    return amount.toFixed(2)
  }

  // Show empty state immediately if no items
  if (items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-6">
          <div className="text-6xl">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-zinc-400">Add some products to continue shopping</p>
          <Link
            href="/public/products"
            className="inline-block px-6 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </main>
    )
  }

  const rawTotal = subtotal()

  const handleShopifyCheckout = async () => {
    try {
      trackClick("shopify_checkout", "/public/check-out")
      toast.loading("Redirecting to secure checkout…", { id: "shopify-checkout" })
      await checkout()
      // If redirect happened, toast will never resolve – that's expected.
    } catch {
      toast.error("Could not start checkout. Please try again.", { id: "shopify-checkout" })
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 animate-in fade-in duration-500">
      {/* LEFT: Checkout CTA */}
      <section className="space-y-10">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-zinc-100 mb-2">Checkout</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            You&apos;ll enter your shipping &amp; payment details securely on Shopify&apos;s checkout page.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 border border-gray-100 dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-zinc-300">
            <ShieldCheck size={16} className="text-green-600" />
            Secure Shopify Checkout
          </div>
          <ul className="text-xs text-gray-500 dark:text-zinc-400 list-disc list-inside space-y-1">
            <li>Shipping address &amp; delivery options</li>
            <li>Credit/debit card, PayPal, and more</li>
            <li>Order confirmation sent to your email</li>
          </ul>
        </div>

        <button
          onClick={handleShopifyCheckout}
          disabled={isCheckingOut}
          className="w-full py-3 px-6 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-all active:scale-[0.98] shadow-lg shadow-green-600/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <ShoppingBag size={18} />
          {isCheckingOut ? "Redirecting…" : `Checkout · ${symbol}${formatAmount(rawTotal)}`}
        </button>
      </section>

      {/* RIGHT: Order Summary */}
      <section className="bg-gray-50 dark:bg-zinc-900 p-8 rounded-lg h-fit lg:sticky lg:top-24 border border-gray-100 dark:border-zinc-800">
        <h2 className="text-xl font-medium dark:text-zinc-100 mb-6">Order Summary</h2>
        <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 items-center">
              <div className="relative w-16 h-20 bg-white rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                <Image src={item.image_url || "/placeholder.png"} alt={item.title} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-zinc-100 truncate">{item.title}</h4>
                <p className="text-xs text-gray-500 dark:text-zinc-400 italic">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                {symbol}{formatAmount(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-zinc-800 pt-6 space-y-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-zinc-400">
            <span>Subtotal</span>
            <span>{symbol}{formatAmount(rawTotal)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-zinc-100 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <span>Total</span>
            <span className="text-green-700">{symbol}{formatAmount(rawTotal)}</span>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
          <ShieldCheck size={16} className="text-green-600" />
          Powered by Shopify Secure Checkout
        </div>
      </section>
    </main>
  )
}