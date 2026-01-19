import Link from "next/link"

const categories = [
  {
    name: "Cleansers",
    slug: "cleansers",
    count: 12,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883"
  },
  {
    name: "Serums",
    slug: "serums",
    count: 8,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108"
  },
  {
    name: "Moisturizers",
    slug: "moisturizers",
    count: 10,
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a"
  },
  {
    name: "Masks",
    slug: "masks",
    count: 6,
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af"
  }
]

export default function HomeCategories() {
  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Left aligned title */}
        <h2 className="text-3xl font-semibold text-gray-900 mb-12">
          Shop By Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group relative rounded-xl overflow-hidden bg-gray-100"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black bg-opacity-25 group-hover:bg-opacity-35 transition" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-white text-lg font-medium tracking-wide">
                  {category.name}
                </span>
                <span className="text-white text-sm opacity-80 mt-1">
                  {category.count} products
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
