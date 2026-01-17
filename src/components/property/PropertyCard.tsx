"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, MapPin, Bed, Bath, Maximize, Eye, CheckCircle, Compass } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatArea } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface PropertyCardProps {
  property: {
    id: string
    title: string
    price: number
    propertyType: string
    listingType: string
    listingTier: string
    bedrooms?: number | null
    bathrooms?: number | null
    builtUpArea?: number | null
    locality: string
    city: string
    images?: string | null
    views: number
    vastuCompliant?: boolean
    facing?: string
  }
  variant?: "default" | "compact" | "horizontal"
}

export default function PropertyCard({ property, variant = "default" }: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState(false)
  const images = property.images ? JSON.parse(property.images) : []
  const mainImage = images[0] || "/placeholder-property.jpg"

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  if (variant === "horizontal") {
    return (
      <Link href={`/property/${property.id}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-earth-200 overflow-hidden card-hover group flex flex-col md:flex-row"
        >
          {/* Image */}
          <div className="relative w-full md:w-72 h-48 md:h-auto overflow-hidden flex-shrink-0">
            <Image
              src={imageError ? "/placeholder-property.jpg" : mainImage}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {property.listingTier === "PREMIUM" && (
                <Badge variant="premium">Premium</Badge>
              )}
              {property.listingTier === "FEATURED" && (
                <Badge variant="featured">Featured</Badge>
              )}
            </div>
            {/* Favorite Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-colors",
                  isLiked ? "text-red-500 fill-red-500" : "text-earth-600"
                )}
              />
            </motion.button>
          </div>

          {/* Content */}
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold text-earth-900">
                    {formatPrice(property.price)}
                  </span>
                  {property.builtUpArea && (
                    <span className="text-sm text-earth-500">
                      ({formatPrice(Math.round(property.price / property.builtUpArea))}/sq.ft)
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-earth-800 group-hover:text-saffron-600 transition-colors line-clamp-1">
                  {property.title}
                </h3>
              </div>
              <Badge variant={property.listingType === "SELL" ? "default" : "secondary"}>
                {property.listingType === "SELL" ? "For Sale" : property.listingType === "RENT" ? "For Rent" : property.listingType}
              </Badge>
            </div>

            <div className="flex items-center gap-1 text-earth-500 text-sm mt-2">
              <MapPin className="w-4 h-4 text-saffron-500" />
              <span className="line-clamp-1">{property.locality}, {property.city}</span>
            </div>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-earth-100">
              {property.bedrooms && (
                <div className="flex items-center gap-1.5 text-earth-600">
                  <Bed className="w-4 h-4" />
                  <span className="text-sm">{property.bedrooms} Beds</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1.5 text-earth-600">
                  <Bath className="w-4 h-4" />
                  <span className="text-sm">{property.bathrooms} Baths</span>
                </div>
              )}
              {property.builtUpArea && (
                <div className="flex items-center gap-1.5 text-earth-600">
                  <Maximize className="w-4 h-4" />
                  <span className="text-sm">{formatArea(property.builtUpArea)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-3">
              {property.vastuCompliant !== false && (
                <Badge variant="vastu-compliant" size="sm">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Vastu
                </Badge>
              )}
              {property.facing && (
                <Badge variant="east-facing" size="sm">
                  <Compass className="w-3 h-3 mr-1" />
                  {property.facing}
                </Badge>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  return (
    <Link href={`/property/${property.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-earth-200 overflow-hidden card-hover group"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageError ? "/placeholder-property.jpg" : mainImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.listingTier === "PREMIUM" && (
              <Badge variant="premium">Premium</Badge>
            )}
            {property.listingTier === "FEATURED" && (
              <Badge variant="featured">Featured</Badge>
            )}
            <Badge variant={property.listingType === "SELL" ? "default" : "secondary"}>
              {property.listingType === "SELL" ? "For Sale" : property.listingType === "RENT" ? "For Rent" : property.listingType}
            </Badge>
          </div>
          {/* Favorite Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-colors",
                isLiked ? "text-red-500 fill-red-500" : "text-earth-600"
              )}
            />
          </motion.button>
          {/* Views */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-earth-900/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            <Eye className="w-3 h-3" />
            {property.views}
          </div>
          {/* Vastu Badge */}
          {property.vastuCompliant !== false && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="vastu-compliant" size="sm">
                <CheckCircle className="w-3 h-3 mr-1" />
                Vastu
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xl font-bold text-earth-900">
              {formatPrice(property.price)}
            </span>
            {property.builtUpArea && (
              <span className="text-sm text-earth-500">
                {formatPrice(Math.round(property.price / property.builtUpArea))}/sq.ft
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-earth-800 group-hover:text-saffron-600 transition-colors line-clamp-1">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-earth-500 text-sm mt-1">
            <MapPin className="w-4 h-4 text-saffron-500" />
            <span className="line-clamp-1">{property.locality}, {property.city}</span>
          </div>

          {/* Property Type */}
          <p className="text-sm text-earth-500 mt-1">{property.propertyType}</p>

          {/* Features */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-earth-100">
            {property.bedrooms && (
              <div className="flex items-center gap-1.5 text-earth-600">
                <Bed className="w-4 h-4" />
                <span className="text-sm">{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1.5 text-earth-600">
                <Bath className="w-4 h-4" />
                <span className="text-sm">{property.bathrooms}</span>
              </div>
            )}
            {property.builtUpArea && (
              <div className="flex items-center gap-1.5 text-earth-600">
                <Maximize className="w-4 h-4" />
                <span className="text-sm">{formatArea(property.builtUpArea)}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
