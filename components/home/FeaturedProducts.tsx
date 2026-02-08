import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/product-card";

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="bg-white py-24 px-4 border-b border-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Left aligned title - matches your brand style */}
        <h2 className="text-3xl font-semibold text-gray-900 mb-12 tracking-tight">
          Featured Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              priority={true} // Since this is at the top, we prioritize these images
            />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <p className="mt-12 text-center text-gray-400 italic">
            Check back soon for our featured selections.
          </p>
        )}
      </div>
    </section>
  );
}