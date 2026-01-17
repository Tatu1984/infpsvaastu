import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaNeon({ connectionString })
const prisma = new PrismaClient({ adapter })

async function createAdmin() {
  const email = process.argv[2] || 'admin@infpsvaastu.com'
  const password = process.argv[3] || 'admin123'
  const name = process.argv[4] || 'Admin User'

  console.log(`Creating admin user: ${email}`)

  try {
    const hashedPassword = await bcrypt.hash(password, 12)

    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        userType: 'ADMIN',
        isVerified: true,
        isActive: true,
      },
      create: {
        email,
        password: hashedPassword,
        name,
        userType: 'ADMIN',
        isVerified: true,
        isActive: true,
      },
    })

    console.log('Admin user created/updated successfully!')
    console.log('Email:', admin.email)
    console.log('Name:', admin.name)
    console.log('User Type:', admin.userType)
    console.log('\nYou can now login at /login with:')
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log('\nAdmin Dashboard: /admin')
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
