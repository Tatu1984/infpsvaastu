import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Calculate date range for trends
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    // Get stats
    const [
      totalProperties,
      activeListings,
      totalViewsAgg,
      totalInquiries,
      totalFavorites,
      recentProperties,
      allProperties,
      recentInquiries,
      notifications,
      // For trend calculation
      thisWeekInquiries,
      lastWeekInquiries,
    ] = await Promise.all([
      prisma.property.count({ where: { userId } }),
      prisma.property.count({ where: { userId, status: "ACTIVE" } }),
      prisma.property.aggregate({
        where: { userId },
        _sum: { views: true },
      }),
      prisma.inquiry.count({ where: { receiverId: userId } }),
      prisma.favorite.count({ where: { property: { userId } } }),
      prisma.property.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          status: true,
          views: true,
          price: true,
          createdAt: true,
          _count: {
            select: { inquiries: true },
          },
        },
      }),
      // All properties for the properties list page
      prisma.property.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          propertyType: true,
          listingType: true,
          city: true,
          locality: true,
          price: true,
          bedrooms: true,
          bathrooms: true,
          builtUpArea: true,
          status: true,
          listingTier: true,
          views: true,
          images: true,
          createdAt: true,
        },
      }),
      prisma.inquiry.findMany({
        where: { receiverId: userId },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          property: {
            select: { title: true },
          },
          sender: {
            select: { name: true, email: true },
          },
        },
      }),
      prisma.notification.findMany({
        where: { userId },
        take: 10,
        orderBy: { createdAt: "desc" },
      }),
      prisma.inquiry.count({
        where: {
          receiverId: userId,
          createdAt: { gte: oneWeekAgo },
        },
      }),
      prisma.inquiry.count({
        where: {
          receiverId: userId,
          createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo },
        },
      }),
    ])

    // Calculate trends
    const inquiriesTrend = lastWeekInquiries > 0
      ? Math.round(((thisWeekInquiries - lastWeekInquiries) / lastWeekInquiries) * 100)
      : thisWeekInquiries > 0 ? 100 : 0

    return NextResponse.json({
      stats: {
        totalProperties,
        activeListings,
        totalViews: totalViewsAgg._sum.views || 0,
        totalInquiries,
        totalFavorites,
        viewsTrend: 0, // Would need PropertyView model with timestamps
        inquiriesTrend,
      },
      recentProperties: recentProperties.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        status: p.status,
        views: p.views,
        inquiries: p._count.inquiries,
        createdAt: p.createdAt.toISOString(),
      })),
      allProperties: allProperties.map((p) => ({
        id: p.id,
        title: p.title,
        propertyType: p.propertyType,
        listingType: p.listingType,
        city: p.city,
        locality: p.locality,
        price: p.price,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        builtUpArea: p.builtUpArea,
        status: p.status,
        listingTier: p.listingTier,
        views: p.views,
        images: p.images,
        createdAt: p.createdAt.toISOString(),
      })),
      recentInquiries: recentInquiries.map((i) => ({
        id: i.id,
        propertyTitle: i.property?.title || "Unknown Property",
        userName: i.sender?.name || "Anonymous",
        userEmail: i.sender?.email || "",
        message: i.message,
        createdAt: i.createdAt.toISOString(),
      })),
      notifications: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        createdAt: n.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}
