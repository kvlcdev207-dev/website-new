import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

// Shape of a comment stored inside a literature document
type StoredComment = {
  id?: string;
  text?: string;
  author?: string;
  authorEmail?: string;
  date?: string;
}

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
      
      // Track who wrote the comment so they can delete it later
      const session = await getServerSession(authOptions)
      const newComment = {
        id: crypto.randomUUID(), // Generates a unique ID for the comment
        text,
        author,
        authorEmail: session?.user?.email,
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
    
    if (action === "deleteComment") {
      // Only the comment author or an admin may delete a comment
      const session = await getServerSession(authOptions)
      const userEmail = session?.user?.email
      const role = session?.user?.role
      const isAdmin = role === "admin" || role === "superadmin"

      if (!userEmail && !isAdmin) {
        return NextResponse.json(
          { error: "You must be signed in to delete a comment." },
          { status: 401 }
        )
      }

      const { commentId } = body
      if (!commentId) {
        return NextResponse.json({ error: "commentId is required" }, { status: 400 })
      }

      const item = await db.collection("literature").findOne({ _id: stringId } as any)
      if (!item) {
        return NextResponse.json({ error: "Literature not found" }, { status: 404 })
      }

      const comments = Array.isArray(item.comments)
        ? (item.comments as StoredComment[])
        : []
      const target = comments.find((c) => c.id === commentId)
      if (!target) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 })
      }

      const isAuthor = Boolean(target.authorEmail && target.authorEmail === userEmail)
      if (!isAdmin && !isAuthor) {
        return NextResponse.json(
          { error: "You can only delete your own comments." },
          { status: 403 }
        )
      }

      const updatedComments = comments.filter((c) => c.id !== commentId)
      const result = await db.collection("literature").updateOne(
        { _id: stringId } as any,
        { $set: { comments: updatedComments } } as Record<string, unknown>
      )

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Literature not found" }, { status: 404 })
      }

      return NextResponse.json({ success: true, comments: updatedComments })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating literature:", error)
    return NextResponse.json({ error: "Failed to update literature" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db("kvlc_database")

    const item = await db.collection("literature").findOne({ _id: String(id) } as any)
    if (!item) {
      return NextResponse.json({ error: "Literature not found" }, { status: 404 })
    }

    // Admins may delete anything; authors may delete their own posts
    const session = await getServerSession(authOptions)
    const role = session?.user?.role
    const isAdmin = role === "admin" || role === "superadmin"
    const isAuthor = Boolean(
      session?.user?.email && item.authorEmail === session.user.email
    )

    if (!isAdmin && !isAuthor) {
      return NextResponse.json(
        { error: "Unauthorized. Admins or the author only." },
        { status: 403 }
      )
    }

    const result = await db
      .collection("literature")
      .deleteOne({ _id: String(id) } as any)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Literature not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Literature deleted" })
  } catch (error) {
    console.error("Error deleting literature:", error)
    return NextResponse.json({ error: "Failed to delete literature" }, { status: 500 })
  }
}