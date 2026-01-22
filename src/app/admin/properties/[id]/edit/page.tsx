"use client"

import { useState, useEffect, use } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Home, MapPin, IndianRupee, Bed, Bath, Square, Camera, Video, Upload, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { ImageUpload } from "@/components/upload/ImageUpload"
import { formatPriceInput, parsePriceInput } from "@/lib/utils"

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [videoUploading, setVideoUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "APARTMENT",
    listingType: "SELL",
    address: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
    bedrooms: "",
    bathrooms: "",
    builtUpArea: "",
    price: "",
    status: "ACTIVE",
    listingTier: "BASIC",
    images: [] as string[],
    videoUrl: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (session?.user?.userType !== "ADMIN") {
      router.push("/admin")
    }
  }, [status, session, router])

  useEffect(() => {
    if (session?.user?.userType === "ADMIN") {
      fetchProperty()
    }
  }, [session, resolvedParams.id])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${resolvedParams.id}`)
      if (!response.ok) {
        router.push("/admin/properties")
        return
      }
      const data = await response.json()
      const property = data.property

      const images = property.images ? JSON.parse(property.images) : []

      setFormData({
        title: property.title || "",
        description: property.description || "",
        propertyType: property.propertyType || "APARTMENT",
        listingType: property.listingType || "SELL",
        address: property.address || "",
        locality: property.locality || "",
        city: property.city || "",
        state: property.state || "",
        pincode: property.pincode || "",
        bedrooms: property.bedrooms?.toString() || "",
        bathrooms: property.bathrooms?.toString() || "",
        builtUpArea: property.builtUpArea?.toString() || "",
        price: property.price?.toString() || "",
        status: property.status || "ACTIVE",
        listingTier: property.listingTier || "BASIC",
        images,
        videoUrl: property.videoUrl || "",
      })
    } catch (error) {
      console.error("Error fetching property:", error)
      router.push("/admin/properties")
    } finally {
      setLoading(false)
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parsePriceInput(e.target.value)
    setFormData({ ...formData, price: rawValue })
  }

  const getDisplayPrice = (value: string): string => {
    if (!value) return ""
    return formatPriceInput(value)
  }

  const getPriceHint = (value: string): string => {
    if (!value) return ""
    const num = parseInt(value, 10)
    if (isNaN(num) || num === 0) return ""
    if (num >= 10000000) {
      const cr = num / 10000000
      const crStr = cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2).replace(/\.?0+$/, "")
      return `= ${crStr} Crore`
    } else if (num >= 100000) {
      const lac = num / 100000
      const lacStr = lac % 1 === 0 ? lac.toFixed(0) : lac.toFixed(2).replace(/\.?0+$/, "")
      return `= ${lacStr} Lac`
    } else if (num >= 1000) {
      const k = num / 1000
      const kStr = k % 1 === 0 ? k.toFixed(0) : k.toFixed(2).replace(/\.?0+$/, "")
      return `= ${kStr} Thousand`
    }
    return ""
  }

  const handleImagesChange = (urls: string[]) => {
    setFormData({ ...formData, images: urls })
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("video/")) {
      alert("Please select a video file")
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      alert("Video must be less than 100MB")
      return
    }

    setVideoUploading(true)
    try {
      const uploadData = new FormData()
      uploadData.append("file", file)
      uploadData.append("category", "properties")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Upload failed")
      }

      const data = await response.json()
      setFormData({ ...formData, videoUrl: data.url })
    } catch (error) {
      console.error("Video upload error:", error)
      alert("Failed to upload video")
    } finally {
      setVideoUploading(false)
      e.target.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/properties/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          builtUpArea: formData.builtUpArea ? parseFloat(formData.builtUpArea) : null,
          price: parseFloat(formData.price),
          images: formData.images.length > 0 ? JSON.stringify(formData.images) : null,
          videoUrl: formData.videoUrl || null,
        }),
      })

      if (response.ok) {
        router.push("/admin/properties")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update property")
      }
    } catch (error) {
      console.error("Error updating property:", error)
      alert("Failed to update property")
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <AdminLayout title="Edit Listing" breadcrumbs={[{ name: "Listings", href: "/admin/properties" }, { name: "Edit" }]}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </AdminLayout>
    )
  }

  if (session?.user?.userType !== "ADMIN") {
    return null
  }

  return (
    <AdminLayout title="Edit Listing" breadcrumbs={[{ name: "Listings", href: "/admin/properties" }, { name: "Edit" }]}>
      <div className="max-w-3xl">
        <Link href="/admin/properties" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" />
              Basic Information
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Property Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 3 BHK Apartment in Bandra West"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the property..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Property Type *</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="APARTMENT">Apartment</option>
                    <option value="HOUSE">House</option>
                    <option value="VILLA">Villa</option>
                    <option value="PLOT">Plot</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="PG">PG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Listing Type *</label>
                  <select
                    value={formData.listingType}
                    onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SELL">For Sale</option>
                    <option value="RENT">For Rent</option>
                    <option value="PG">PG</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Location Details
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Locality *</label>
                  <input
                    type="text"
                    required
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Bandra West"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Mumbai"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Maharashtra"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 400050"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Square className="w-5 h-5 text-blue-600" />
              Property Details
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Bed className="w-4 h-4 inline mr-1" />
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Bath className="w-4 h-4 inline mr-1" />
                  Bathrooms
                </label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Square className="w-4 h-4 inline mr-1" />
                  Built-up Area (sq.ft)
                </label>
                <input
                  type="number"
                  value={formData.builtUpArea}
                  onChange={(e) => setFormData({ ...formData, builtUpArea: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-blue-600" />
              Pricing & Status
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price (₹) *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={getDisplayPrice(formData.price)}
                  onChange={handlePriceChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 50,00,000"
                />
                {formData.price && (
                  <p className="text-sm text-blue-600 mt-1 font-medium">
                    {getPriceHint(formData.price)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="ACTIVE">Active</option>
                  <option value="SOLD">Sold</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Listing Tier</label>
                <select
                  value={formData.listingTier}
                  onChange={(e) => setFormData({ ...formData, listingTier: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BASIC">Basic</option>
                  <option value="FEATURED">Featured</option>
                  <option value="PREMIUM">Premium</option>
                </select>
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              Property Media
            </h3>

            <div className="space-y-6">
              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Property Photos
                </label>
                <p className="text-sm text-slate-500 mb-3">
                  Upload up to 10 photos. First image will be the cover photo.
                </p>
                <ImageUpload
                  value={formData.images}
                  onChange={handleImagesChange}
                  maxFiles={10}
                  maxSize={5}
                  category="properties"
                />
              </div>

              {/* Video */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Video className="w-4 h-4 inline mr-1" />
                  Property Video (Optional)
                </label>
                <p className="text-sm text-slate-500 mb-3">
                  Upload a video (max 100MB) or paste a YouTube URL
                </p>

                {formData.videoUrl ? (
                  <div className="relative border border-slate-200 rounded-xl p-4 bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Video className="w-10 h-10 text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">Video added</p>
                        <p className="text-xs text-slate-500 truncate">{formData.videoUrl}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, videoUrl: "" })}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        disabled={videoUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                        videoUploading ? "bg-slate-100 border-slate-300" : "border-slate-300 hover:border-blue-400"
                      }`}>
                        {videoUploading ? (
                          <div className="flex flex-col items-center">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                            <p className="text-slate-600">Uploading video...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                            <p className="text-slate-600">Click to upload video</p>
                            <p className="text-xs text-slate-500 mt-1">MP4, MOV, AVI (Max 100MB)</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 border-t border-slate-300" />
                      <span className="text-sm text-slate-500">or</span>
                      <div className="flex-1 border-t border-slate-300" />
                    </div>

                    <input
                      type="text"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Paste YouTube URL: https://youtube.com/watch?v=..."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link href="/admin/properties" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
