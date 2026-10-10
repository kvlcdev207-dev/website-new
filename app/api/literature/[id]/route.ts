import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db("kvlc_database")
    
    // Use string ID directly since we seeded with string IDs ("1", "2", etc.)
      const item = await db.collection("literature").findOne({ _id: String(id) } as any)
    
    if (!item) {
      return NextResponse.json({ error: "Literature not found" }, { status: 404 })
    }
    
    return NextResponse.json(item)
  } catch (error) {
    console.error("Error fetching literature:", error)
    return NextResponse.json({ error: "Failed to fetch literature" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action, data } = body
    
    const client = await clientPromise
    const db = client.db("kvlc_database")
    
    const stringId = String(id)
    
    if (action === "like") {
      const { email } = body

      if (!email) {
        return NextResponse.json({ error: "Email is required to like" }, { status: 400 })
      }

      // Find the item to check whether this user already liked it
      const item = await db.collection("literature").findOne({ _id: stringId } as any)

      if (!item) {
        return NextResponse.json({ error: "Literature not found" }, { status: 404 })
      }

      const likedBy: string[] = Array.isArray(item.likedBy) ? item.likedBy : []
      const alreadyLiked = likedBy.includes(email)

      // Toggle the like: remove it if present, add it if not
      const result = await db.collection("literature").updateOne(
        { _id: stringId } as any,
        alreadyLiked
          ? { $pull: { likedBy: email }, $inc: { likes: -1 } }
          : { $push: { likedBy: email }, $inc: { likes: 1 } }
      )

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Literature not found" }, { status: 404 })
      }

      const updated = await db.collection("literature").findOne({ _id: stringId } as any)
      return NextResponse.json({
        success: true,
        likes: updated?.likes,
        likedBy: updated?.likedBy || [],
      })
    }
    
    if (action === "comment") {
      const { text, author } = data || {}
      
      if (!text || !author) {
        return NextResponse.json({ error: "Comment text and author are required" }, { status: 400 })
      }
      
      const newComment = {
        id: crypto.randomUUID(), // Generates a unique ID for the comment
        text,
        author,
        date: new Date().toISOString(),
      }
      
      const result = await db.collection("literature").updateOne(
        { _id: stringId } as any,
        { $push: { comments: newComment } } as Record<string, unknown>
      )
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Literature not found" }, { status: 404 })
      }
      
      const updated = await db.collection("literature").findOne({ _id: stringId } as any)
      return NextResponse.json({ success: true, comment: newComment, comments: updated?.comments })
    }
    
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating literature:", error)
    return NextResponse.json({ error: "Failed to update literature" }, { status: 500 })
  }
}