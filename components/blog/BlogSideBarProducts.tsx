import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Hydrating Face Serum",
    price: 45,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883"
  },
  {
    id: 2,
    name: "Gentle Cleansing Foam",
    price: 32,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108"
  },
  {
    id: 3,
    name: "Nourishing Night Cream",
    price: 58,
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a"
  }
]

export default function BlogSidebarProducts() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Products you may like
      </h3>

      <div className="space-y-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href="/products"
            className="flex gap-4 group"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg group-hover:opacity-90 transition"
            />

            <div>
              <p className="text-sm font-medium text-gray-900">
                {product.name}
              </p>
              <p className="text-sm text-gray-600">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
