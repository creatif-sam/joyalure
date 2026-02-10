"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ShoppingCart, Heart, Loader2, Package } from "lucide-react"

export function CustomerListDetails({ customerId }: { customerId: string }) {
  const [data, setData] = useState<{ cart: any[], wishlist: any[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchDetails() {
      const [cartRes, wishRes] = await Promise.all([
        supabase.from('cart_items').select('*, products(*)').eq('customer_id', customerId),
        supabase.from('wishlist_items').select('*, products(*)').eq('customer_id', customerId)
      ])
      
      setData({
        cart: cartRes.data || [],
        wishlist: wishRes.data || []
      })
      setLoading(false)
    }
    fetchDetails()
  }, [customerId, supabase])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="animate-spin h-8 w-8 text-green-600" />
        <p className="text-sm text-gray-500 dark:text-zinc-400 animate-pulse">Fetching lists...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* CART SECTION */}
      <section>
        <h3 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-gray-900 dark:text-zinc-100 mb-4">
          <ShoppingCart className="h-4 w-4 text-blue-500" /> 
          Active Cart
        </h3>
        
        {data?.cart.length === 0 ? (
          <div className="py-6 border-2 border-dashed dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center">
            <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">No items in cart</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data?.cart.map(item => (
              <div 
                key={item.id} 
                className="group flex items-center justify-between p-3 rounded-xl border dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-white dark:bg-zinc-800 border dark:border-zinc-700 flex items-center justify-center">
                     <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">{item.products.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-green-600 dark:text-green-400">
                  ${((item.products.price * item.quantity) / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* WISHLIST SECTION */}
      <section>
        <h3 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-gray-900 dark:text-zinc-100 mb-4">
          <Heart className="h-4 w-4 text-pink-500" /> 
          Wishlist
        </h3>
        
        {data?.wishlist.length === 0 ? (
          <div className="py-6 border-2 border-dashed dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center">
            <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">Wishlist is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data?.wishlist.map(item => (
              <div 
                key={item.id} 
                className="p-3 rounded-xl border dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col gap-1 hover:border-pink-200 dark:hover:border-pink-900/30 transition-colors"
              >
                <span className="text-xs font-bold text-gray-900 dark:text-zinc-100 truncate">
                  {item.products.name}
                </span>
                <span className="text-[10px] font-mono text-gray-500">
                  ${(item.products.price / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}