"use client"

import { useState, useEffect, use } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Home,
  MapPin,
  Bed,
  IndianRupee,
  Camera,
  ChevronRight,
  Check,
  Video,
  Upload,
  X,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/upload/ImageUpload"
import { formatPriceInput, parsePriceInput } from "@/lib/utils"
import Link from "next/link"

const propertyTypes = [
  "APARTMENT",
  "HOUSE",
  "VILLA",
  "PLOT",
  "COMMERCIAL",
  "PG",
]

const listingTypes = [
  { id: "SELL", label: "Sell" },
  { id: "RENT", label: "Rent" },
  { id: "PG", label: "PG/Roommate" },
]

const furnishingOptions = ["UNFURNISHED", "SEMI_FURNISHED", "FURNISHED"]

const facingOptions = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"]

const amenitiesList = [
  "Swimming Pool",
  "Gym",
  "Parking",
  "Security",
  "Garden",
  "Lift",
  "Power Backup",
  "Water Supply",
  "Club House",
  "Children Play Area",
  "Gas Pipeline",
  "CCTV",
]

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [videoUploading, setVideoUploading] = useState(false)
  const [formData, setFormData] = useState({
    // Basic Info
    listingType: "SELL",
    propertyType: "APARTMENT",
    title: "",
    description: "",

    // Location
    address: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",

    // Property Details
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    floorNumber: "",
    totalFloors: "",
    facing: "",
    furnishing: "UNFURNISHED",

    // Area
    builtUpArea: "",
    carpetArea: "",
    plotArea: "",

    // Price
    price: "",
    pricePerSqft: "",
    maintenance: "",
    securityDeposit: "",

    // Additional
    amenities: [] as string[],
    images: [] as string[],
    videoUrl: "",
    availableFrom: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      fetchProperty()
    }
  }, [status, resolvedParams.id])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${resolvedParams.id}`)
      if (!response.ok) {
        router.push("/dashboard/properties")
        return
      }
      const data = await response.json()
      const property = data.property

      // Check if user owns this property
      if (property.userId !== session?.user?.id) {
        router.push("/dashboard/properties")
        return
      }

      // Parse JSON fields
      const images = property.images ? JSON.parse(property.images) : []
      const amenities = property.amenities ? JSON.parse(property.amenities) : []

      setFormData({
        listingType: property.listingType || "SELL",
        propertyType: property.propertyType || "APARTMENT",
        title: property.title || "",
        description: property.description || "",
        address: property.address || "",
        locality: property.locality || "",
        city: property.city || "",
        state: property.state || "",
        pincode: property.pincode || "",
        bedrooms: property.bedrooms?.toString() || "",
        bathrooms: property.bathrooms?.toString() || "",
        balconies: property.balconies?.toString() || "",
        floorNumber: property.floorNumber?.toString() || "",
        totalFloors: property.totalFloors?.toString() || "",
        facing: property.facing || "",
        furnishing: property.furnishing || "UNFURNISHED",
        builtUpArea: property.builtUpArea?.toString() || "",
        carpetArea: property.carpetArea?.toString() || "",
        plotArea: property.plotArea?.toString() || "",
        price: property.price?.toString() || "",
        pricePerSqft: property.pricePerSqft?.toString() || "",
        maintenance: property.maintenance?.toString() || "",
        securityDeposit: property.securityDeposit?.toString() || "",
        amenities,
        images,
        videoUrl: property.videoUrl || "",
        availableFrom: property.availableFrom ? property.availableFrom.split("T")[0] : "",
      })
    } catch (error) {
      console.error("Error fetching property:", error)
      router.push("/dashboard/properties")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parsePriceInput(e.target.value)
    setFormData((prev) => ({ ...prev, price: rawValue }))
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
    setFormData((prev) => ({ ...prev, images: urls }))
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
      const formData = new FormData()
      formData.append("file", file)
      formData.append("category", "properties")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Upload failed")
      }

      const data = await response.json()
      setFormData((prev) => ({ ...prev, videoUrl: data.url }))
    } catch (error) {
      console.error("Video upload error:", error)
      alert("Failed to upload video")
    } finally {
      setVideoUploading(false)
      e.target.value = ""
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/properties/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          balconies: formData.balconies ? parseInt(formData.balconies) : null,
          floorNumber: formData.floorNumber ? parseInt(formData.floorNumber) : null,
          totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : null,
          builtUpArea: formData.builtUpArea ? parseFloat(formData.builtUpArea) : null,
          carpetArea: formData.carpetArea ? parseFloat(formData.carpetArea) : null,
          plotArea: formData.plotArea ? parseFloat(formData.plotArea) : null,
          price: parseFloat(formData.price),
          pricePerSqft: formData.pricePerSqft ? parseFloat(formData.pricePerSqft) : null,
          maintenance: formData.maintenance ? parseFloat(formData.maintenance) : null,
          securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : null,
          images: formData.images.length > 0 ? JSON.stringify(formData.images) : null,
          amenities: formData.amenities.length > 0 ? JSON.stringify(formData.amenities) : null,
        }),
      })

      if (response.ok) {
        router.push("/dashboard/properties?updated=true")
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

  const steps = [
    { id: 1, title: "Basic Info" },
    { id: 2, title: "Location" },
    { id: 3, title: "Details" },
    { id: 4, title: "Price & Photos" },
  ]

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/properties"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
          <p className="text-gray-600 mt-1">Update your property listing details</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => setStep(s.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                  step >= s.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                }`}
              >
                {step > s.id ? <Check className="w-5 h-5" /> : s.id}
              </button>
              <span
                className={`ml-2 text-sm hidden sm:inline ${
                  step >= s.id ? "text-blue-600 font-medium" : "text-gray-500"
                }`}
              >
                {s.title}
              </span>
              {index < steps.length - 1 && (
                <ChevronRight className="w-5 h-5 mx-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Listing Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I want to *
                </label>
                <div className="flex gap-3">
                  {listingTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData((prev) => ({ ...prev, listingType: type.id }))}
                      className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
                        formData.listingType === type.id
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {propertyTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData((prev) => ({ ...prev, propertyType: type }))}
                      className={`py-3 rounded-lg border-2 font-medium transition-colors ${
                        formData.propertyType === type
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <Input
                  name="title"
                  placeholder="e.g., 3 BHK Apartment in Whitefield"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your property..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <Button className="w-full" onClick={() => setStep(2)} disabled={!formData.title}>
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <Input
                  name="address"
                  placeholder="Flat No, Building Name, Street"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Locality *</label>
                <Input
                  name="locality"
                  placeholder="e.g., Whitefield"
                  value={formData.locality}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <Input
                    name="city"
                    placeholder="e.g., Bangalore"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <Input
                    name="state"
                    placeholder="e.g., Karnataka"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <Input
                  name="pincode"
                  placeholder="e.g., 560066"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setStep(3)}
                  disabled={!formData.address || !formData.city || !formData.state}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Property Details */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bed className="w-5 h-5" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <Input
                    name="bedrooms"
                    type="number"
                    placeholder="0"
                    value={formData.bedrooms}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <Input
                    name="bathrooms"
                    type="number"
                    placeholder="0"
                    value={formData.bathrooms}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Balconies</label>
                  <Input
                    name="balconies"
                    type="number"
                    placeholder="0"
                    value={formData.balconies}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor Number
                  </label>
                  <Input
                    name="floorNumber"
                    type="number"
                    placeholder="0"
                    value={formData.floorNumber}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Floors
                  </label>
                  <Input
                    name="totalFloors"
                    type="number"
                    placeholder="0"
                    value={formData.totalFloors}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facing</label>
                  <select
                    name="facing"
                    value={formData.facing}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    {facingOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing</label>
                  <select
                    name="furnishing"
                    value={formData.furnishing}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {furnishingOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Built-up Area (sq.ft)
                  </label>
                  <Input
                    name="builtUpArea"
                    type="number"
                    placeholder="0"
                    value={formData.builtUpArea}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carpet Area (sq.ft)
                  </label>
                  <Input
                    name="carpetArea"
                    type="number"
                    placeholder="0"
                    value={formData.carpetArea}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plot Area (sq.ft)
                  </label>
                  <Input
                    name="plotArea"
                    type="number"
                    placeholder="0"
                    value={formData.plotArea}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="grid grid-cols-3 gap-2">
                  {amenitiesList.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                        formData.amenities.includes(amenity)
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button className="flex-1" onClick={() => setStep(4)}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Price & Photos */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                Price & Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                <Input
                  name="price"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g., 50,00,000"
                  value={getDisplayPrice(formData.price)}
                  onChange={handlePriceChange}
                />
                {formData.price && (
                  <p className="text-sm text-blue-600 mt-1 font-medium">
                    {getPriceHint(formData.price)}
                  </p>
                )}
              </div>

              {formData.listingType === "RENT" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maintenance (₹/month)
                    </label>
                    <Input
                      name="maintenance"
                      type="number"
                      placeholder="0"
                      value={formData.maintenance}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Security Deposit (₹)
                    </label>
                    <Input
                      name="securityDeposit"
                      type="number"
                      placeholder="0"
                      value={formData.securityDeposit}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available From
                </label>
                <Input
                  name="availableFrom"
                  type="date"
                  value={formData.availableFrom}
                  onChange={handleChange}
                />
              </div>

              {/* Property Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Camera className="w-4 h-4 inline mr-1" />
                  Property Photos
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Upload up to 10 photos. First image will be the primary/cover image.
                </p>
                <ImageUpload
                  value={formData.images}
                  onChange={handleImagesChange}
                  maxFiles={10}
                  maxSize={5}
                  category="properties"
                />
              </div>

              {/* Property Video */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Video className="w-4 h-4 inline mr-1" />
                  Property Video (Optional)
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Upload a video tour of your property (Max 100MB) or paste a YouTube URL
                </p>

                {formData.videoUrl ? (
                  <div className="relative border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Video className="w-10 h-10 text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Video uploaded</p>
                        <p className="text-xs text-gray-500 truncate">{formData.videoUrl}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData((prev) => ({ ...prev, videoUrl: "" }))}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Video File Upload */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        disabled={videoUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          videoUploading
                            ? "bg-gray-100 border-gray-300"
                            : "border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {videoUploading ? (
                          <div className="flex flex-col items-center">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                            <p className="text-gray-600">Uploading video...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-gray-600">Click to upload video file</p>
                            <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI (Max 100MB)</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* YouTube URL */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 border-t border-gray-300" />
                      <span className="text-sm text-gray-500">or</span>
                      <div className="flex-1 border-t border-gray-300" />
                    </div>
                    <Input
                      name="videoUrl"
                      placeholder="Paste YouTube URL: https://youtube.com/watch?v=..."
                      value={formData.videoUrl}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={saving || !formData.price}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
