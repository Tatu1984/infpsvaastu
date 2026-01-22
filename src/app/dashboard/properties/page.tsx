"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Home,
  MapPin,
  Bed,
  Bath,
  Square,
  MoreVertical,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"

interface Property {
  id: string
  title: string
  propertyType: string
  listingType: string
  city: string
  locality: string
  price: number
  bedrooms: number | null
  bathrooms: number | null
  builtUpArea: number | null
  status: string
  listingTier: string
  views: number
  images: string | null
  createdAt: string
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  ACTIVE: "bg-green-100 text-green-700",
  SOLD: "bg-blue-100 text-blue-700",
  EXPIRED: "bg-red-100 text-red-700",
}

export default function MyPropertiesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; property: Property | null }>({
    show: false,
    property: null,
  })
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchProperties()
    }
  }, [session])

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/users/dashboard")
      if (response.ok) {
        const data = await response.json()
        setProperties(data.allProperties || [])
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.property) return
    setDeleting(true)
    try {
      const response = await fetch(`/api/properties/${deleteModal.property.id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setProperties(properties.filter((p) => p.id !== deleteModal.property?.id))
        setDeleteModal({ show: false, property: null })
      } else {
        const data = await response.json()
        alert(data.error || "Failed to delete property")
      }
    } catch (error) {
      console.error("Error deleting property:", error)
      alert("Failed to delete property")
    } finally {
      setDeleting(false)
    }
  }

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "ALL" || property.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
            <p className="text-gray-600 mt-1">Manage your property listings</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/post-property">
              <Plus className="w-4 h-4 mr-2" />
              Post Property
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="ACTIVE">Active</option>
                <option value="SOLD">Sold</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {properties.filter((p) => p.status === "ACTIVE").length}
                </p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {properties.filter((p) => p.status === "PENDING").length}
                </p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {properties.reduce((acc, p) => acc + p.views, 0)}
                </p>
                <p className="text-sm text-gray-500">Total Views</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties List */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              const images = property.images ? JSON.parse(property.images) : []
              return (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Image */}
                  <div className="relative h-48">
                    {images[0] ? (
                      <Image
                        src={images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Home className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[property.status]}`}
                      >
                        {property.status}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                      <Eye className="w-3 h-3" />
                      {property.views}
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800 line-clamp-1">{property.title}</h3>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {property.listingType}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {property.locality}, {property.city}
                      </span>
                    </div>

                    <p className="text-xl font-bold text-blue-600 mb-3">
                      {formatPrice(property.price)}
                      {property.listingType === "RENT" && (
                        <span className="text-sm font-normal">/mo</span>
                      )}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      {property.bedrooms && (
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4 text-gray-400" />
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4 text-gray-400" />
                          <span>{property.bathrooms}</span>
                        </div>
                      )}
                      {property.builtUpArea && (
                        <div className="flex items-center gap-1">
                          <Square className="w-4 h-4 text-gray-400" />
                          <span>{property.builtUpArea} sq.ft</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <Link href={`/property/${property.id}`} target="_blank">
                          <button
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <Link href={`/dashboard/properties/${property.id}/edit`}>
                          <button
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ show: true, property })}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-500 mb-4">
                {properties.length === 0
                  ? "You haven't listed any properties yet"
                  : "Try adjusting your search or filters"}
              </p>
              {properties.length === 0 && (
                <Button asChild>
                  <Link href="/dashboard/post-property">Post Your First Property</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal.show && deleteModal.property && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-2">Delete Property</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete <strong>{deleteModal.property.title}</strong>? This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteModal({ show: false, property: null })}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
