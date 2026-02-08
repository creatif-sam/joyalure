"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export default function AddToCartButton({ product }: { product: any }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <button
      onClick={() => addItem({ ...product, quantity: 1 })}
      className="flex items-center gap-2 text-sm border border-gray-900 px-4 py-2 rounded-md transition-colors duration-300 hover:bg-gray-900 hover:text-white"
    >
      <ShoppingBag size={16} />
      Add
    </button>
  );
}