"use client"

import { createClient } from "@/lib/supabase/client"

export async function uploadProductImage(file: File) {
  const supabase = createClient()

  const ext = file.name.split(".").pop()
  const fileName = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, file)

  if (error) throw error

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName)

  return data.publicUrl
}
