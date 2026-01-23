"use client"

import { useSettings } from "@/lib/settings-context"
import Link from "next/link"

export function PreviewHero() {
  const { settings } = useSettings()

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-gray-900">
      {/* Background Image/Video Preview */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-600">
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-xl">
            <p className="text-white text-sm tracking-widest mb-4">
              {settings.siteName?.toUpperCase() || "PREMIUM SKINCARE"}
            </p>

            <h1 className="text-white text-5xl md:text-6xl font-semibold leading-tight mb-8">
              {settings.heroTitle}
            </h1>

            <p className="text-white text-xl mb-8 opacity-90">
              {settings.heroSubtitle}
            </p>

            <Link
              href={settings.heroCtaLink}
              className="
                inline-block
                px-10 py-4
                rounded-sm
                bg-yellow-500
                text-white
                text-sm
                tracking-wide
                transition-colors
                duration-500
                hover:bg-green-600
              "
            >
              {settings.heroCtaText}
            </Link>
          </div>
        </div>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            className="relative w-2.5 h-2.5"
            aria-label={`Slide ${i + 1}`}
          >
            <span
              className={`absolute inset-0 rounded-full ${
                i === 0 ? "bg-white" : "bg-white bg-opacity-40"
              }`}
            />

            {i === 0 && (
              <span className="absolute inset-0 rounded-full border border-white animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </section>
  )
}