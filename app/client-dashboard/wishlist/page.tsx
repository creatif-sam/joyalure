export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import RemoveWishlistButton from "./remove-button"

export default async function WishlistPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}
      }
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: wishlist } = await supabase
    .from("wishlist")
    .select(`
      id,
      products (
        id,
        name,
        price,
        image_url,
        slug
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-semibold text-green-700">
          Wishlist
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Products you have saved for later.
        </p>
      </div>

      {!wishlist || wishlist.length === 0 && (
        <EmptyWishlist />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlist?.map(item => (
          <WishlistCard key={item.id} item={item} />
        ))}
      </div>

    </div>
  )
}

function WishlistCard({ item }: { item: any }) {
  const product = item.products

  return (
    <div className="bg-white border border-green-100 rounded-lg overflow-hidden">
      <img
        src={product.image_url}
        alt={product.name}
        className="h-40 w-full object-cover"
      />

      <div className="p-4 space-y-2">
        <h3 className="font-medium text-green-700">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600">
          ${product.price}
        </p>

        <div className="flex justify-between items-center">
          <a
            href={`/products/${product.slug}`}
            className="text-sm text-green-700 hover:underline"
          >
            View product
          </a>

          <RemoveWishlistButton wishlistId={item.id} />
        </div>
      </div>
    </div>
  )
}

function EmptyWishlist() {
  return (
    <div className="bg-white border border-green-100 rounded-lg p-6 text-center">
      <p className="text-sm text-gray-500">
        Your wishlist is empty.
      </p>
    </div>
  )
}
