"use client"

import { useEffect, useState } from "react"
import { useCartStore } from "@/lib/cart-store"
import { useCurrencyStore } from "@/lib/currency-store" // Integrated Currency Store
import { toast } from "sonner"
import Image from "next/image"
import { CreditCard, Wallet, Smartphone, ShieldCheck } from "lucide-react"

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false)
  const { items, subtotal } = useCartStore()
  const { currency, rate } = useCurrencyStore() // Get currency state
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal" | "mtn">("stripe")

  useEffect(() => { setMounted(true) }, [])

  // Currency Helpers
  const symbol = currency === "USD" ? "$" : "₵";
  
  const formatAmount = (priceInCents: number) => {
    const amount = currency === "USD" 
      ? (priceInCents / 100) 
      : (priceInCents / 100) * rate;
    return amount.toFixed(2);
  };

  if (!mounted || items.length === 0) return (
    <div className="py-20 text-center italic text-gray-500">Your cart is empty.</div>
  )

  const rawTotal = subtotal()

  const handleProcessOrder = async () => {
    toast.info(`Initializing ${paymentMethod.toUpperCase()} payment...`, {
      description: `Total to pay: ${symbol}${formatAmount(rawTotal)}`,
    })
    // Gateway specific logic would follow here
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 animate-in fade-in duration-500">
      {/* LEFT: Shipping & Payment */}
      <section className="space-y-10">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">Checkout</h1>
          <div className="space-y-4">
            <input placeholder="Email Address" className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none transition" />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="First Name" className="p-4 border border-gray-200 rounded-xl outline-none" />
              <input placeholder="Last Name" className="p-4 border border-gray-200 rounded-xl outline-none" />
            </div>
            <input placeholder="Shipping Address" className="w-full p-4 border border-gray-200 rounded-xl outline-none" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium mb-4">Payment Method</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <PaymentOption 
              id="stripe" 
              active={paymentMethod === "stripe"} 
              onClick={() => setPaymentMethod("stripe")}
              icon={<CreditCard size={20} />}
              label="Card / Stripe"
            />
            <PaymentOption 
              id="paypal" 
              active={paymentMethod === "paypal"} 
              onClick={() => setPaymentMethod("paypal")}
              icon={<Wallet size={20} />}
              label="PayPal"
            />
            <PaymentOption 
              id="mtn" 
              active={paymentMethod === "mtn"} 
              onClick={() => setPaymentMethod("mtn")}
              icon={<Smartphone size={20} />}
              label="MTN Money"
            />
          </div>
        </div>

        {/* DYNAMIC PAYMENT BUTTON */}
        <button 
          onClick={handleProcessOrder}
          className="w-full py-5 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all active:scale-[0.98] shadow-lg shadow-green-600/20"
        >
          Pay {symbol}{formatAmount(rawTotal)}
        </button>
      </section>

      {/* RIGHT: Order Summary */}
      <section className="bg-gray-50 p-8 rounded-3xl h-fit lg:sticky lg:top-24 border border-gray-100">
        <h2 className="text-xl font-medium mb-6">Order Summary</h2>
        <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 items-center">
              <div className="relative w-16 h-20 bg-white rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                <Image src={item.image_url || "/placeholder.png"} alt={item.title} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                <p className="text-xs text-gray-500 italic">Quantity: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {symbol}{formatAmount(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{symbol}{formatAmount(rawTotal)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-gray-200">
            <span>Total to pay</span>
            <span className="text-green-700">{symbol}{formatAmount(rawTotal)}</span>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
          <ShieldCheck size={16} className="text-green-600" /> 
          Verified Secure Checkout
        </div>
      </section>
    </main>
  )
}

function PaymentOption({ id, active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-3 p-4 border-2 rounded-2xl transition-all ${
        active 
          ? 'border-green-600 bg-green-50 text-green-700' 
          : 'border-white bg-white hover:border-gray-200 text-gray-500 shadow-sm'
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  )
}