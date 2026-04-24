import Link from "next/link"
import Image from "next/image"
import { getSpecialOffers } from "@/lib/supabase/special-offers"
import { SpecialOfferCountdown } from "@/components/special-offer-countdown"

export default async function SpecialOffers() {
  const offers = await getSpecialOffers()

  if (offers.length === 0) {
    return null
  }

  return (
    <section className="bg-white dark:bg-zinc-950 py-24 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="relative h-[360px] rounded-2xl overflow-hidden group border dark:border-zinc-800"
          >
            <Image
              src={offer.image_url || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"}
              alt={offer.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
              <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
                SAVE {offer.discount_percentage}%
              </span>
              <SpecialOfferCountdown endDate={offer.end_date} />
              <h3 className="text-white text-3xl font-black tracking-tighter uppercase mt-6 mb-6">
                {offer.title}
              </h3>
              {offer.description && (
                <p className="text-white/80 text-sm mb-6 max-w-md">
                  {offer.description}
                </p>
              )}
              <Link
                href={offer.link_url || `/products?offer=${offer.discount_percentage}`}
                className="inline-block bg-yellow-400 text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-md hover:bg-green-600 hover:text-white transition-all active:scale-95 shadow-lg shadow-yellow-400/20 hover:shadow-green-600/20"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
