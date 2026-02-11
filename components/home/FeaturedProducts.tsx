import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/product-card";

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="bg-white dark:bg-zinc-950 py-24 px-4 border-b border-gray-50 dark:border-zinc-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Title: Dynamic text colors for dark mode visibility */}
        <h2 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-zinc-100 mb-12 italic uppercase">
          Featured Products
        </h2>

        {/* Grid: Ensure layout is stable during theme shifts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              priority={true} 
            />
          ))}
        </div>

        {/* Empty State: Softened for Dark Mode */}
        {products.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-400 dark:text-zinc-600 italic font-medium tracking-tight">
              Check back soon for our featured selections.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}