"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createProduct(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const name = formData.get("name") as string
  const price = Number(formData.get("price"))
  const image = formData.get("image") as File

  if (!image || !(image instanceof File)) {
    throw new Error("Image is required")
  }

  const fileExt = image.name.split(".").pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, image, {
      contentType: image.type, // ✅ REQUIRED
      cacheControl: "3600",
      upsert: false
    })

  if (uploadError) {
    console.error("STORAGE UPLOAD ERROR:", uploadError)
    throw new Error(uploadError.message)
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName)

  const { error: insertError } = await supabase
    .from("products")
    .insert({
      name,
      price,
      image_url: data.publicUrl,
      is_featured: false
    })

  if (insertError) {
    console.error("DB INSERT ERROR:", insertError)
    throw new Error("Product creation failed")
  }

  revalidatePath("/admin/products")
  revalidatePath("/")
}

export async function toggleFeatured(
  productId: string,
  value: boolean
) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from("products")
    .update({ is_featured: value })
    .eq("id", productId)

  if (error) {
    throw new Error("Failed to update featured status")
  }

  revalidatePath("/admin/products")
  revalidatePath("/")
}
