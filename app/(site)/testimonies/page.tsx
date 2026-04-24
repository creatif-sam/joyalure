import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getTestimonies } from "@/lib/supabase/testimonies"
import TestimoniesGrid from "@/components/testimonies-grid"

export default async function TestimoniesPage() {
  const testimonies = await getTestimonies()

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(22,163,74,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-500 transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-gray-900 dark:text-zinc-100 mb-4 uppercase">
            Customer <span className="text-green-600">Testimonies</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-zinc-400 max-w-2xl">
            Real experiences from our valued customers around the world. See what they have to say about Joyalure.
          </p>
        </div>
      </section>

      {/* Filter tabs + animated grid delegated to client component */}
      <TestimoniesGrid testimonies={testimonies} />
    </main>
  )
}
