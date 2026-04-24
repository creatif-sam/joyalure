"use client"

import { createClient } from "@/lib/supabase/client"

export async function uploadTestimonyScreenshot(file: File) {
  const supabase = createClient()

  const ext = file.name.split(".").pop()
  const fileName = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from("testimony-screenshots")
    .upload(fileName, file)

  if (error) throw error

  const { data } = supabase.storage
    .from("testimony-screenshots")
    .getPublicUrl(fileName)

  return data.publicUrl
}

export async function deleteTestimonyScreenshot(imageUrl: string) {
  const supabase = createClient()
  
  // Extract the file name from the URL
  const urlParts = imageUrl.split("/")
  const fileName = urlParts[urlParts.length - 1]

  const { error } = await supabase.storage
    .from("testimony-screenshots")
    .remove([fileName])

  if (error) throw error
}
