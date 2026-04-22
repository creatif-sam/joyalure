import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, title, message, data } = body

    // Validate required fields
    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create notification using admin client
    const { data: notification, error } = await supabaseAdmin
      .from("notifications")
      .insert({
        user_id: userId,
        type,
        title,
        message,
        data,
        read: false,
      } as any)
      .select("id")
      .single()

    if (error) {
      console.error("Error creating notification:", error)
      return NextResponse.json(
        { error: "Failed to create notification" },
        { status: 500 }
      )
    }

    return NextResponse.json({ id: notification.id }, { status: 201 })
  } catch (error) {
    console.error("Error in notification creation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
