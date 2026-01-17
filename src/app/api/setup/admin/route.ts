import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// This endpoint only checks if admin exists - no creation allowed via API
// Admin creation should only be done via CLI: npm run create-admin
export async function POST() {
  // Disabled in production for security
  return NextResponse.json(
    { error: "Admin creation via API is disabled. Use CLI: npm run create-admin" },
    { status: 403 }
  )
}

// GET endpoint to check if admin exists
export async function GET() {
  try {
    const admin = await prisma.user.findFirst({
      where: { userType: "ADMIN" },
      select: { id: true, email: true, name: true, isActive: true }
    })

    if (admin) {
      return NextResponse.json({
        exists: true,
        admin: {
          email: admin.email,
          name: admin.name,
          isActive: admin.isActive
        }
      })
    }

    return NextResponse.json({
      exists: false,
      message: "No admin user found. POST to this endpoint to create one."
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: String(error) },
      { status: 500 }
    )
  }
}
