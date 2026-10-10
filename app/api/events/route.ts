import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("kvlc_database")
    const events = await db.collection("events").find({}).sort({ date: 1 }).toArray()
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Received event data:", body)
    
    const { title, date, location, status, type, description } = body

    if (!title || !date || !location || !status || !type) {
      console.error("Missing required fields:", { title, date, location, status, type })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Parse date - handle both YYYY-MM-DD and ISO string formats
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
    const result = await db.collection("events").insertOne({
      title,
      date: eventDate,
      location,
      status,
      type,
      description: description || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log("Event created successfully:", result.insertedId)
    return NextResponse.json({ success: true, eventId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}