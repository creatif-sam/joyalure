import Link from "next/link";
import Image from "next/image";
import { getHomeCategories } from "@/lib/categories";
import { ArrowRight } from "lucide-react";

export default async function HomeCategories() {
  const categories = await getHomeCategories();

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              The Collection
            </h2>
            <p className="text-gray-500 text-sm italic">Tailored skincare for your unique glow.</p>
          </div>
          <Link 
            href="/products" 
            className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-green-700 transition-colors flex items-center gap-2"
          >
            Browse All <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4:3 GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/public/products?category=${category.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3]"
            >
              {/* IMAGE */}
              <Image
                src={category.image || "/placeholder-cat.jpg"}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 25vw"
              />

              {/* GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* CONTENT AREA */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-white text-lg font-bold tracking-tight block">
                    {category.name}
                  </span>
                  
                  <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">
                      {category.count} Essentials
                    </span>
                    <div className="h-[1px] flex-1 bg-white/30" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}