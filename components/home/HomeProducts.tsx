"use client";

import { useState } from "react";
import ProductCard from "@/components/product-card";

// Define the product type to match our database helper output
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
    <section className="bg-white py-24 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Toggle Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <h2 className="text-2xl md:text-3xl font-serif text-gray-900">
            {mode === "featured" ? "Our Favorites" : "The Latest"}
          </h2>

          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(["featured", "recent"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-md ${
                  mode === m 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid - Now using the Shared ProductCard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              // Priority is true for featured mode to boost LCP scores
              priority={mode === "featured"} 
            />
          ))}
        </div>

        {/* Fallback for empty states */}
        {products.length === 0 && (
          <p className="mt-12 text-center text-gray-500 italic">
            No products found in this category.
          </p>
        )}
      </div>
    </section>
  );
}