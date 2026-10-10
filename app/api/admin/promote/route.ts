import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is superadmin
    if (session?.user?.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized. Only superadmins can promote users." }, { status: 403 })
    }

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("kvlc_database")
    
    // Check if user exists
    const user = await db.collection("users").findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if already admin or superadmin
    if (user.role === "admin" || user.role === "superadmin") {
      return NextResponse.json({ error: "User is already an admin or superadmin" }, { status: 400 })
    }

    // Promote user to admin
    const result = await db.collection("users").updateOne(
      { email },
      { $set: { role: "admin", updatedAt: new Date() } }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Failed to promote user" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "User promoted to admin successfully!" })
  } catch (error) {
    console.error("Error promoting user:", error)
    return NextResponse.json({ error: "Failed to promote user" }, { status: 500 })
  }
}