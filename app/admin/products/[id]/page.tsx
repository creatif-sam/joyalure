
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { getCategories } from "@/lib/supabase/categories"
import { updateProduct } from "@/lib/actions/products"

export default async function Page({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createServerSupabaseClient({ cookies: cookieStore });
  const categories = await getCategories();

  const { data: product } = await supabase
    .from("products")
    .select(`*, product_categories ( category_id )`)
    .eq("id", params.id)
    .single();

  if (!product) {
    return <div className="p-8 text-center text-red-500">Product not found.</div>;
  }

  const selected = product.product_categories?.map(
    (pc: { category_id: string }) => pc.category_id
  ) || [];

  return (
    <form
      action={updateProduct}
      encType="multipart/form-data"
      className="max-w-2xl space-y-6"
    >
      <input type="hidden" name="id" value={product.id} />

      <input
        name="title"
        defaultValue={product.title}
        className="w-full border p-3"
      />

      <textarea
        name="description"
        defaultValue={product.description}
        className="w-full border p-3"
      />

      <input
        name="price"
        type="number"
        defaultValue={product.price}
        className="w-full border p-3"
      />

      <input name="image" type="file" />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={product.featured}
        />
        Featured
      </label>

      <div>
        {categories.map((c) => (
          <label key={c.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              name="categories"
              value={c.id}
              defaultChecked={selected.includes(c.id)}
            />
            {c.name}
          </label>
        ))}
      </div>

      <button className="px-6 py-3 bg-black text-white">
        Update product
      </button>
    </form>
  )
}
