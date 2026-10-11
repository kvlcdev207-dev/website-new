import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

const defaultImpact = {
  peopleHelped: 0,
  eventsHeld: 0,
  volunteerHours: 0,
  activeMembers: 0,
}

// The siteSettings collection uses a string _id (e.g. "impact")
type SiteSettings = {
  _id: string;
  peopleHelped: number;
  eventsHeld: number;
  volunteerHours: number;
  activeMembers: number;
  updatedAt?: Date;
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("kvlc_database")
    const settings = await db
      .collection<SiteSettings>("siteSettings")
      .findOne({ _id: "impact" })

    if (!settings) {
      return NextResponse.json(defaultImpact)
    }

    return NextResponse.json({
      peopleHelped: Number(settings.peopleHelped) || 0,
      eventsHeld: Number(settings.eventsHeld) || 0,
      volunteerHours: Number(settings.volunteerHours) || 0,
      activeMembers: Number(settings.activeMembers) || 0,
    })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    // Only admins may update site settings (checked on the server)
    const session = await getServerSession(authOptions)
    const role = session?.user?.role
    if (role !== "admin" && role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized. Admins only." }, { status: 403 })
    }

    const body = await request.json()
    const { peopleHelped, eventsHeld, volunteerHours, activeMembers } = body

    const numbers = { peopleHelped, eventsHeld, volunteerHours, activeMembers }
    for (const [key, value] of Object.entries(numbers)) {
      if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
        return NextResponse.json(
          { error: `${key} must be a non-negative number` },
          { status: 400 }
        )
      }
    }

    const client = await clientPromise
    const db = client.db("kvlc_database")
    await db
      .collection<SiteSettings>("siteSettings")
      .updateOne(
        { _id: "impact" },
        { $set: { ...numbers, updatedAt: new Date() } },
        { upsert: true }
      )

    return NextResponse.json({ success: true, ...numbers })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
