import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

// Shape of a past work item stored in the pastWork collection
type PastWorkInput = {
  title: string
  year: string
  description: string
  imageUrl: string
}

// Only admins and the super admin may change past work
const isAdmin = (role: string | undefined) =>
  role === "admin" || role === "superadmin"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("kvlc_database")
    const items = await db
      .collection("pastWork")
      .find({})
      .sort({ year: -1, createdAt: 1 })
      .toArray()
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching past work:", error)
    return NextResponse.json(
      { error: "Failed to fetch past work" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Server-side permission check: admins only
    const session = await getServerSession(authOptions)
    if (!isAdmin(session?.user?.role)) {
      return NextResponse.json({ error: "Admins only." }, { status: 403 })
    }

    const body = await request.json()
    const { title, year, description, imageUrl } = body as Partial<PastWorkInput>

    // Never trust data from the browser: validate on the server
    if (!title?.trim() || !year?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "Title, year and description are required" },
        { status: 400 }
      )
    }
    if (!/^\d{4}\/\d{2}$/.test(year.trim())) {
      return NextResponse.json(
        { error: "Year must look like 2026/27" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("kvlc_database")
    const result = await db.collection("pastWork").insertOne({
      title: title.trim(),
      year: year.trim(),
      description: description.trim(),
      imageUrl: (imageUrl ?? "").trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      { success: true, itemId: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating past work:", error)
    return NextResponse.json(
      { error: "Failed to create past work" },
      { status: 500 }
    )
  }
}
