"use client";

import { useState } from "react";
import ProductCard from "@/components/product-card";

type Product = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  category?: { name: string } | null;
};

export default function HomeProducts({ 
  featured, 
  recent 
}: { 
  featured: Product[], 
  recent: Product[] 
}) {
  const [mode, setMode] = useState<"featured" | "recent">("featured");
  const products = mode === "featured" ? featured : recent;

  return (
    <section className="bg-white dark:bg-zinc-950 py-24 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Toggle Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 dark:text-zinc-100 italic uppercase">
            {mode === "featured" ? "Our Favorites" : "The Latest"}
          </h2>

          {/* Toggle Switch: Adapted for Dark Mode */}
          <div className="flex bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl transition-colors">
            {(["featured", "recent"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${
                  mode === m 
                    ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm" 
                    : "text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-300"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              priority={mode === "featured"} 
            />
          ))}
        </div>

        {/* Fallback: Adapted for Dark Mode */}
        {products.length === 0 && (
          <p className="mt-12 text-center text-gray-500 dark:text-zinc-600 italic text-sm">
            No products found in this category.
          </p>
        )}
      </div>
    </section>
  );
}