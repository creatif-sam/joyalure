import { createClient } from "@/lib/supabase/server"
import { getCategories } from "@/lib/supabase/categories"
import { updateProduct } from "@/lib/actions/products"

export default async function EditProductPage({ params }: any) {
  const supabase = createClient()
  const categories = await getCategories()

  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      product_categories ( category_id )
    `)
    .eq("id", params.id)
    .single()

  const selected = product.product_categories.map(
    (pc: any) => pc.category_id
  )

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
