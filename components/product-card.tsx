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
    <div className="group relative bg-white flex flex-col h-full rounded-xl transition-all duration-300 hover:shadow-md p-2">
      {/* 4 X 3 DIMENSION IMAGE SECTION */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#fcfcfc]">
        <Image
          src={product.image_url || "/placeholder.png"}
          alt={product.title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* COMPACT HEART OVERLAY */}
        <button 
          onClick={() => toggleWishlist(product)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm transition-all hover:bg-white active:scale-90"
        >
          <Heart 
            size={14} 
            className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-900"} 
          />
        </button>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex flex-col px-1 pt-2 flex-grow">
        {/* CATEGORY LABEL */}
        {product.category?.name && (
          <span className="text-[9px] font-bold text-green-700 uppercase tracking-[0.15em] mb-0.5">
            {product.category.name}
          </span>
        )}

        <h3 className="text-[12px] font-bold text-gray-800 line-clamp-1 mb-2 tracking-tight">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[14px] font-black text-gray-900">
            {currencySymbol}{convertedPrice.toFixed(2)}
          </span>

          <button
            onClick={() => {
              addItem({ ...product, quantity: 1 });
              toast.success(`${product.title} added`);
            }}
            className="p-1.5 bg-gray-900 text-white rounded-lg hover:bg-green-600 transition-all active:scale-95 shadow-sm"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}