import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const formData = await req.formData()

    const title = formData.get("name") as string
    const slug = formData.get("slug") as string
    const price = Number(formData.get("price"))
    const image = formData.get("image") as File

    if (!title || !slug || !price || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const fileExt = image.name.split(".").pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, image, {
        contentType: image.type,
        upsert: false
      })

    if (uploadError) {
      console.error("UPLOAD ERROR:", uploadError)
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      )
    }

    const { data: publicData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName)

    const { error: insertError } = await supabase
      .from("products")
      .insert({
        title,
        slug,
        price,
        image_url: publicData.publicUrl,
        active: true,
        is_featured: false
      })

    if (insertError) {
      console.error("INSERT ERROR:", insertError)
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("SERVER ERROR:", err)
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    )
  }
}
