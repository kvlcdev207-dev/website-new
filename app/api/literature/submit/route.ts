import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

const allowedCategories = ["poetry", "stories", "blogs"]

// Documents in the literature collection use string IDs (seeded and submitted this way)
type LiteratureDocument = {
  _id: string;
  category: string;
  title: string;
  author: string;
  excerpt: string;
  date: string;
  fullContent: string;
  likes: number;
  comments: Array<Record<string, unknown>>;
  likedBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: Request) {
  try {
    // Only signed-in users may submit writing (checked on the server)
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be signed in to submit writing." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, category, content } = body

    // Validate required fields
    if (!title || !String(title).trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }
    if (!category || !allowedCategories.includes(category)) {
      return NextResponse.json(
        { error: "Category must be poetry, stories, or blogs" },
        { status: 400 }
      )
    }
    if (!content || !String(content).trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Author comes from the signed-in session, never from the client
    const author = session.user.name || "Anonymous"

    const client = await clientPromise
    const db = client.db("kvlc_database")

    const result = await db
      .collection<LiteratureDocument>("literature")
      .insertOne({
      _id: crypto.randomUUID(),
      category,
      title: String(title).trim(),
      author,
      excerpt: String(content).trim().slice(0, 160),
      date: new Date().toISOString(),
      fullContent: content,
      likes: 0,
      comments: [],
      likedBy: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        success: true,
        message: "Writing published successfully!",
        id: result.insertedId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error submitting literature:", error)
    return NextResponse.json({ error: "Failed to submit writing" }, { status: 500 })
  }
}
