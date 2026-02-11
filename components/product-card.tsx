"use client";

import { Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useCartStore } from "@/lib/cart-store";
import { useShopStore } from "@/lib/shop-store";
import { useCurrencyStore } from "@/lib/currency-store";

export default function ProductCard({ product, priority = false }: any) {
  const addItem = useCartStore((s) => s.addItem);
  const { wishlist, toggleWishlist } = useShopStore();
  const { currency, rate } = useCurrencyStore();

  const isWishlisted = wishlist?.some((item) => item.id === product.id);
  const convertedPrice = currency === "USD" ? (product.price / 100) : (product.price / 100) * rate;
  const currencySymbol = currency === "USD" ? "$" : "₵";

  return (
    <div className="group relative bg-white dark:bg-zinc-900 flex flex-col h-full rounded-2xl transition-all duration-500 hover:shadow-md dark:hover:shadow-zinc-950/50 p-2 border border-transparent dark:border-zinc-800/50">
      
      {/* IMAGE SECTION: Optimized background for dark mode */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#fcfcfc] dark:bg-zinc-950">
        <Image
          src={product.image_url || "/placeholder.png"}
          alt={product.title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* HEART OVERLAY: Adapted for dark mode transparency */}
        <button 
          onClick={() => toggleWishlist(product)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm transition-all hover:bg-white dark:hover:bg-zinc-800 active:scale-90"
        >
          <Heart 
            size={14} 
            className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-900 dark:text-zinc-100"} 
          />
        </button>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex flex-col px-1 pt-3 flex-grow">
        {/* CATEGORY LABEL: Using Joyalure Green */}
        {product.category?.name && (
          <span className="text-[9px] font-black text-green-700 dark:text-green-500 uppercase tracking-[0.2em] mb-1">
            {product.category.name}
          </span>
        )}

        <h3 className="text-[12px] font-bold text-gray-800 dark:text-zinc-100 line-clamp-1 mb-3 tracking-tight">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between mt-auto pb-1">
          <span className="text-[14px] font-black text-gray-900 dark:text-zinc-50 italic uppercase tracking-tighter">
            {currencySymbol}{convertedPrice.toFixed(2)}
          </span>

          {/* ADD TO CART: Inverted color logic for dark mode */}
          <button
            onClick={() => {
              addItem({ ...product, quantity: 1 });
              toast.success(`${product.title} added`);
            }}
            className="p-2 bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-green-600 dark:hover:bg-green-500 dark:hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}