import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

const allowedRoles = ["user", "admin", "superadmin"]

// This route reads the session, so it must run on demand, not at build time
export const dynamic = "force-dynamic"

// Shape of an admin entry returned to the admin dashboard
type AdminUser = {
  name?: string
  email: string
  role: string
}

export async function GET() {
  try {
    // Only admins may view the admin list
    const session = await getServerSession(authOptions)
    const role = session?.user?.role
    if (role !== "admin" && role !== "superadmin") {
      return NextResponse.json({ error: "Admins only." }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db("kvlc_database")
    const users = await db
      .collection("users")
      .find({ role: { $in: ["admin", "superadmin"] } })
      .sort({ role: -1, email: 1 })
      .toArray()

    const admins: AdminUser[] = users.map((u) => ({
      name: u.name,
      email: u.email,
      role: u.role,
    }))

    return NextResponse.json({ admins })
  } catch (error) {
    console.error("Error fetching admins:", error)
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    // Only the super admin may change roles
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "superadmin") {
      return NextResponse.json({ error: "Super admin only." }, { status: 403 })
    }

    const body = await request.json()
    const { email, role } = body

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      )
    }
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // The super admin account is fixed by SUPER_ADMIN_EMAIL and cannot be changed
    const superAdminEmail = String(process.env.SUPER_ADMIN_EMAIL || "")
    if (
      superAdminEmail &&
      String(email).trim().toLowerCase() === superAdminEmail.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "The super admin role cannot be changed" },
        { status: 403 }
      )
    }

    const client = await clientPromise
    const db = client.db("kvlc_database")
    const result = await db
      .collection("users")
      .updateOne({ email: String(email).trim() }, { $set: { role } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "User role updated",
    })
  } catch (error) {
    console.error("Error updating admin role:", error)
    return NextResponse.json(
      { error: "Failed to update admin role" },
      { status: 500 }
    )
  }
}
