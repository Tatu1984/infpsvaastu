import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

// This endpoint creates an admin user for initial setup
// It should be disabled or removed in production
export async function POST() {
  try {
    const email = "admin@infpsvaastu.com"
    const password = "admin123"
    const name = "Admin User"

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      // Update password in case it was changed
      const hashedPassword = await bcrypt.hash(password, 12)
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          userType: "ADMIN",
          isVerified: true,
          isActive: true,
        }
      })

      return NextResponse.json({
        message: "Admin user already exists. Password has been reset.",
        email,
        password,
      })
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 12)
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        userType: "ADMIN",
        isVerified: true,
        isActive: true,
      }
    })

    return NextResponse.json({
      message: "Admin user created successfully!",
      email,
      password,
      userId: admin.id,
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json(
      { error: "Failed to create admin user", details: String(error) },
      { status: 500 }
    )
  }
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
