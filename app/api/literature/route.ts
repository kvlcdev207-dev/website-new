import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("kvlc_database")
    const items = await db
      .collection("literature")
      .find({})
      .sort({ date: -1 })
      .toArray()
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching literature:", error)
    return NextResponse.json({ error: "Failed to fetch literature" }, { status: 500 })
  }
}
