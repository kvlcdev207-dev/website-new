import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    console.log("Updating event:", id, body)
    
    const { title, date, location, status, type, description } = body

    if (!title || !date || !location || !status || !type) {
      console.error("Missing required fields:", { title, date, location, status, type })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let eventDate: Date
    try {
      eventDate = new Date(date)
      if (isNaN(eventDate.getTime())) {
        throw new Error("Invalid date")
      }
    } catch (e) {
      console.error("Invalid date format:", date)
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("kvlc_database")
    const result = await db.collection("events").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          date: eventDate,
          location,
          status,
          type,
          description: description || "",
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    console.log("Event updated successfully:", id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log("Deleting event:", id)
    
    const client = await clientPromise
    const db = client.db("kvlc_database")
    const result = await db.collection("events").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    console.log("Event deleted successfully:", id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}