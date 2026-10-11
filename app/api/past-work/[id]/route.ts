import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("kvlc_database")
    const item = await db
      .collection("pastWork")
      .findOne({ _id: new ObjectId(id) })

    if (!item) {
      return NextResponse.json(
        { error: "Past work item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error fetching past work item:", error)
    return NextResponse.json(
      { error: "Failed to fetch past work item" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Server-side permission check: admins only
    const session = await getServerSession(authOptions)
    if (!isAdmin(session?.user?.role)) {
      return NextResponse.json({ error: "Admins only." }, { status: 403 })
    }

    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
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
    const result = await db.collection("pastWork").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: title.trim(),
          year: year.trim(),
          description: description.trim(),
          imageUrl: (imageUrl ?? "").trim(),
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Past work item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating past work:", error)
    return NextResponse.json(
      { error: "Failed to update past work" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Server-side permission check: admins only
    const session = await getServerSession(authOptions)
    if (!isAdmin(session?.user?.role)) {
      return NextResponse.json({ error: "Admins only." }, { status: 403 })
    }

    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("kvlc_database")
    const result = await db
      .collection("pastWork")
      .deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Past work item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting past work:", error)
    return NextResponse.json(
      { error: "Failed to delete past work" },
      { status: 500 }
    )
  }
}
