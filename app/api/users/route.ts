import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export const dynamic = 'force-dynamic';

// Shape of a user row returned to the admin dashboard
type UserRow = {
  name?: string
  email: string
  role: string
  // True when this row is the club's super admin account
  isSuperAdmin: boolean
}

export async function GET() {
  try {
    // Only admins may view the user list
    const session = await getServerSession(authOptions)
    const role = session?.user?.role
    if (role !== "admin" && role !== "superadmin") {
      return NextResponse.json({ error: "Admins only." }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db("kvlc_database")
    const users = await db
      .collection("users")
      .find({})
      .sort({ role: -1, email: 1 })
      .toArray()

    const superAdminEmail = String(process.env.SUPER_ADMIN_EMAIL || "")
    const rows: UserRow[] = users.map((u) => ({
      name: u.name,
      email: u.email,
      role: u.role,
      isSuperAdmin:
        superAdminEmail !== "" &&
        String(u.email).toLowerCase() === superAdminEmail.toLowerCase(),
    }))

    return NextResponse.json({ users: rows })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
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
    if (role !== "admin" && role !== "user") {
      return NextResponse.json(
        { error: 'Role must be "admin" or "user"' },
        { status: 400 }
      )
    }

    // The super admin account is fixed by SUPER_ADMIN_EMAIL and cannot be changed
    const superAdminEmail = String(process.env.SUPER_ADMIN_EMAIL || "")
    if (
      superAdminEmail !== "" &&
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
    console.error("Error updating user role:", error)
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    )
  }
}
