import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "INFPSVaastu - Find Your Perfect Vastu-Compliant Home",
  description: "Discover Vastu-compliant properties for sale and rent across India. Browse apartments, houses, villas, and commercial spaces with verified listings.",
  keywords: ["real estate", "property", "vastu", "homes for sale", "rent property", "India"],
  openGraph: {
    title: "INFPSVaastu - Find Your Perfect Vastu-Compliant Home",
    description: "Discover Vastu-compliant properties for sale and rent across India.",
    type: "website",
  },
}
import Image from "next/image"
import {
  Building2,
  Users,
  Home,
  ArrowRight,
  Star,
  MapPin,
  Compass,
  CheckCircle,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { HeroSection } from "@/components/home/HeroSection"
import { StatsSection } from "@/components/home/StatsSection"
import { FeaturesSection } from "@/components/home/FeaturesSection"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"

export const dynamic = 'force-dynamic'

const cities = [
  { name: "Mumbai", image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400", count: 12500 },
  { name: "Delhi", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400", count: 10200 },
  { name: "Bangalore", image: "https://images.unsplash.com/photo-1599686523092-af2e62b1b77b?w=400", count: 9800 },
  { name: "Hyderabad", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400", count: 7500 },
  { name: "Chennai", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400", count: 6200 },
  { name: "Pune", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400", count: 5800 },
]

async function getFeaturedProperties() {
  try {
    return await prisma.property.findMany({
      where: {
        status: "ACTIVE",
        listingTier: { in: ["FEATURED", "PREMIUM"] },
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    })
  } catch {
    return []
  }
}

async function getFeaturedAgents() {
  try {
    return await prisma.agentProfile.findMany({
      where: { isFeatured: true },
      include: { user: true },
      take: 4,
    })
  } catch {
    return []
  }
}

async function getFeaturedProjects() {
  try {
    return await prisma.project.findMany({
      where: { isFeatured: true },
      include: { builder: { include: { user: true } } },
      take: 4,
    })
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [properties, agents, projects] = await Promise.all([
    getFeaturedProperties(),
    getFeaturedAgents(),
    getFeaturedProjects(),
  ])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Popular Cities */}
      <section className="py-16 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge variant="vastu" className="mb-4">
              <Compass className="w-3 h-3 mr-1" />
              Explore Locations
            </Badge>
            <h2 className="text-3xl font-bold text-earth-900">
              Find Vastu Properties by City
            </h2>
            <p className="mt-2 text-earth-600">
              Discover your perfect sacred space in India&apos;s top cities
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cities.map((city, index) => (
              <Link
                key={city.name}
                href={`/search?city=${city.name}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-earth-200 card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-earth-900/80 via-earth-900/30 to-transparent z-10" />
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-white font-semibold text-lg">{city.name}</h3>
                  <p className="text-earth-200 text-sm">{city.count.toLocaleString()}+ Properties</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <Badge variant="featured" className="mb-2">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
              <h2 className="text-3xl font-bold text-earth-900">Vastu-Verified Properties</h2>
              <p className="mt-2 text-earth-600">Hand-picked properties with authentic Vastu compliance</p>
            </div>
            <Link href="/search?tier=featured">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => {
                const images = property.images ? JSON.parse(property.images) : []
                return (
                  <Link
                    key={property.id}
                    href={`/property/${property.id}`}
                    className="bg-white rounded-2xl border border-earth-200 overflow-hidden card-hover group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={images[0] || "/placeholder-property.jpg"}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {property.listingTier === "PREMIUM" && <Badge variant="premium">Premium</Badge>}
                        {property.listingTier === "FEATURED" && <Badge variant="featured">Featured</Badge>}
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="vastu-compliant" size="sm">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Vastu
                        </Badge>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-2xl font-bold text-earth-900">{formatPrice(property.price)}</p>
                      <h3 className="font-semibold text-earth-800 mt-1 line-clamp-1 group-hover:text-saffron-600 transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 text-earth-500 text-sm mt-2">
                        <MapPin className="w-4 h-4 text-saffron-500" />
                        <span>{property.locality}, {property.city}</span>
                      </div>
                      <div className="flex gap-4 mt-4 pt-4 border-t border-earth-100 text-sm text-earth-600">
                        {property.bedrooms && <span className="flex items-center gap-1"><Home className="w-4 h-4" /> {property.bedrooms} Beds</span>}
                        {property.bathrooms && <span>{property.bathrooms} Baths</span>}
                        {property.builtUpArea && <span>{property.builtUpArea} sq.ft</span>}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-earth-50 rounded-2xl border-2 border-dashed border-earth-200">
              <div className="w-16 h-16 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-saffron-600" />
              </div>
              <p className="text-earth-600 mb-4">No featured properties yet. Be the first to list!</p>
              <Link href="/admin/properties/add">
                <Button variant="gradient">Post Property</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Featured Projects */}
      <section className="py-16 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <Badge variant="gold" className="mb-2">
                <Building2 className="w-3 h-3 mr-1" />
                Projects
              </Badge>
              <h2 className="text-3xl font-bold text-earth-900">Popular Projects</h2>
              <p className="mt-2 text-earth-600">Top projects from trusted builders with Vastu certification</p>
            </div>
            <Link href="/projects">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {projects.map((project) => {
                const images = project.images ? JSON.parse(project.images) : []
                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="bg-white rounded-2xl border border-earth-200 overflow-hidden card-hover group"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={images[0] || "/placeholder-project.jpg"}
                        alt={project.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <Badge
                        className="absolute top-3 left-3"
                        variant={project.status === "COMPLETED" ? "success" : "secondary"}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-earth-900 group-hover:text-saffron-600 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-earth-500">by {project.builder.companyName}</p>
                      <div className="flex items-center gap-1 text-earth-500 text-sm mt-2">
                        <MapPin className="w-4 h-4 text-saffron-500" />
                        <span>{project.location}, {project.city}</span>
                      </div>
                      {project.priceRange && (
                        <p className="text-saffron-600 font-semibold mt-2">{project.priceRange}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-earth-200">
              <Building2 className="w-12 h-12 text-earth-300 mx-auto mb-4" />
              <p className="text-earth-600">No featured projects yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Agents */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <Badge variant="vastu" className="mb-2">
                <Users className="w-3 h-3 mr-1" />
                Expert Agents
              </Badge>
              <h2 className="text-3xl font-bold text-earth-900">Top Vastu Consultants</h2>
              <p className="mt-2 text-earth-600">Work with certified Vastu experts and real estate professionals</p>
            </div>
            <Link href="/agents">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {agents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {agents.map((agent) => (
                <Link
                  key={agent.id}
                  href={`/agents/${agent.id}`}
                  className="bg-white rounded-2xl border border-earth-200 p-6 text-center card-hover group"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-saffron-100 to-gold-100 rounded-full mx-auto mb-4 flex items-center justify-center ring-4 ring-saffron-50">
                    <Users className="w-10 h-10 text-saffron-600" />
                  </div>
                  <h3 className="font-semibold text-earth-900 group-hover:text-saffron-600 transition-colors">
                    {agent.user.name}
                  </h3>
                  {agent.companyName && (
                    <p className="text-sm text-earth-500">{agent.companyName}</p>
                  )}
                  <div className="flex items-center justify-center gap-1 mt-3">
                    <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
                    <span className="text-sm font-medium text-earth-700">{agent.rating.toFixed(1)}</span>
                    <span className="text-sm text-earth-500">({agent.totalDeals} deals)</span>
                  </div>
                  {agent.city && (
                    <p className="text-sm text-earth-500 mt-2 flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {agent.city}, {agent.state}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-earth-50 rounded-2xl border border-earth-200">
              <Users className="w-12 h-12 text-earth-300 mx-auto mb-4" />
              <p className="text-earth-600">No featured agents yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-earth-900 via-saffron-900 to-earth-900 p-8 md:p-12 text-white">
            {/* Pattern overlay */}
            <div className="absolute inset-0 pattern-vastu opacity-20" />

            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Your <span className="gradient-text-gold">Sacred Space</span>?
              </h2>
              <p className="text-earth-200 max-w-2xl mx-auto mb-8">
                Join thousands of property owners who trust INFPSVaastu. List your Vastu-compliant property for free and reach millions of seekers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/admin/properties/add">
                  <Button size="xl" variant="gradient" className="w-full sm:w-auto">
                    Post Property Free
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="xl" variant="outline-gold" className="w-full sm:w-auto border-gold-400 text-gold-400 hover:bg-gold-400/10">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
