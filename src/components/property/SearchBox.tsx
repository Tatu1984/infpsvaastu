"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, MapPin, Home, ChevronDown, Compass, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const propertyCategories = [
  { label: "All Categories", value: "" },
  { label: "Residential", value: "RESIDENTIAL" },
  { label: "Commercial", value: "COMMERCIAL" },
]

const propertyTypesByCategory: Record<string, string[]> = {
  "": ["All Types", "Apartment", "House", "Villa", "Plot", "Office Space", "Shop", "Warehouse", "PG"],
  "RESIDENTIAL": ["All Residential", "Apartment", "House", "Villa", "Plot", "PG", "Penthouse", "Studio", "Independent Floor"],
  "COMMERCIAL": ["All Commercial", "Office Space", "Shop", "Showroom", "Warehouse", "Industrial", "Co-working Space", "Restaurant Space"],
}

const budgetRanges = [
  { label: "Any Budget", min: 0, max: 0 },
  { label: "Under ₹50 Lac", min: 0, max: 5000000 },
  { label: "₹50 Lac - ₹1 Cr", min: 5000000, max: 10000000 },
  { label: "₹1 Cr - ₹2 Cr", min: 10000000, max: 20000000 },
  { label: "₹2 Cr - ₹5 Cr", min: 20000000, max: 50000000 },
  { label: "Above ₹5 Cr", min: 50000000, max: 0 },
]

interface SearchBoxProps {
  variant?: "hero" | "compact"
}

export default function SearchBox({ variant = "hero" }: SearchBoxProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"SELL" | "RENT" | "PG">("SELL")
  const [location, setLocation] = useState("")
  const [propertyCategory, setPropertyCategory] = useState("")
  const [propertyType, setPropertyType] = useState("All Types")
  const [budget, setBudget] = useState(budgetRanges[0])
  const [showCategory, setShowCategory] = useState(false)
  const [showPropertyTypes, setShowPropertyTypes] = useState(false)
  const [showBudget, setShowBudget] = useState(false)

  const availablePropertyTypes = propertyTypesByCategory[propertyCategory] || propertyTypesByCategory[""]
  const currentCategoryLabel = propertyCategories.find(c => c.value === propertyCategory)?.label || "All Categories"

  const closeAllDropdowns = () => {
    setShowCategory(false)
    setShowPropertyTypes(false)
    setShowBudget(false)
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    params.set("type", activeTab)
    if (location) params.set("location", location)
    if (propertyCategory) params.set("category", propertyCategory)
    if (propertyType && !propertyType.startsWith("All")) params.set("propertyType", propertyType)
    if (budget.min > 0) params.set("minPrice", budget.min.toString())
    if (budget.max > 0) params.set("maxPrice", budget.max.toString())

    router.push(`/search?${params.toString()}`)
  }

  if (variant === "compact") {
    return (
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
          <Input
            placeholder="Search by location, project, or builder"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} variant="gradient">Search</Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl shadow-2xl p-6 max-w-5xl mx-auto border border-white/20"
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-1 p-1 bg-earth-100 rounded-xl">
          {(["SELL", "RENT", "PG"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === tab
                  ? "bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md"
                  : "text-earth-600 hover:text-earth-900 hover:bg-white/50"
              )}
            >
              {tab === "SELL" ? "Buy" : tab === "RENT" ? "Rent" : "PG/Co-living"}
            </button>
          ))}
        </div>

        {/* Category Toggle */}
        <div className="flex gap-1 p-1 bg-earth-100 rounded-xl">
          {propertyCategories.map((category) => (
            <button
              key={category.value}
              onClick={() => {
                setPropertyCategory(category.value)
                setPropertyType(propertyTypesByCategory[category.value]?.[0] || "All Types")
              }}
              className={cn(
                "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                propertyCategory === category.value
                  ? "bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-md"
                  : "text-earth-600 hover:text-earth-900 hover:bg-white/50"
              )}
            >
              {category.value === "COMMERCIAL" ? <Building2 className="w-4 h-4" /> : category.value === "RESIDENTIAL" ? <Home className="w-4 h-4" /> : null}
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Fields */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Location */}
        <div className="md:col-span-5">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-saffron-500" />
            <Input
              placeholder="Enter city, locality, or project"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-12 h-14 text-base border-earth-200 focus:ring-saffron-500 bg-white"
            />
          </div>
        </div>

        {/* Property Type Dropdown */}
        <div className="md:col-span-4 relative">
          <button
            onClick={() => {
              setShowPropertyTypes(!showPropertyTypes)
              setShowCategory(false)
              setShowBudget(false)
            }}
            className={cn(
              "w-full h-14 px-4 flex items-center justify-between border rounded-lg text-left transition-all duration-200 bg-white",
              showPropertyTypes
                ? "border-saffron-500 ring-2 ring-saffron-500"
                : "border-earth-200 hover:border-earth-300"
            )}
          >
            <div className="flex items-center gap-3">
              {propertyCategory === "COMMERCIAL" ? (
                <Building2 className="w-5 h-5 text-saffron-500" />
              ) : (
                <Home className="w-5 h-5 text-saffron-500" />
              )}
              <span className={propertyType.startsWith("All") ? "text-earth-400" : "text-earth-900"}>
                {propertyType}
              </span>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-earth-400 transition-transform",
              showPropertyTypes && "rotate-180"
            )} />
          </button>
          {showPropertyTypes && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-earth-200 rounded-xl shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto"
            >
              {availablePropertyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setPropertyType(type)
                    setShowPropertyTypes(false)
                  }}
                  className={cn(
                    "w-full px-4 py-3 text-left text-sm hover:bg-saffron-50 transition-colors",
                    propertyType === type && "bg-saffron-50 text-saffron-700 font-medium"
                  )}
                >
                  {type}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Budget Dropdown */}
        <div className="md:col-span-3 relative">
          <button
            onClick={() => {
              setShowBudget(!showBudget)
              setShowPropertyTypes(false)
              setShowCategory(false)
            }}
            className={cn(
              "w-full h-14 px-4 flex items-center justify-between border rounded-lg text-left transition-all duration-200 bg-white",
              showBudget
                ? "border-saffron-500 ring-2 ring-saffron-500"
                : "border-earth-200 hover:border-earth-300"
            )}
          >
            <span className={budget.label === "Any Budget" ? "text-earth-400" : "text-earth-900"}>
              {budget.label}
            </span>
            <ChevronDown className={cn(
              "w-4 h-4 text-earth-400 transition-transform",
              showBudget && "rotate-180"
            )} />
          </button>
          {showBudget && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-earth-200 rounded-xl shadow-lg z-20 overflow-hidden"
            >
              {budgetRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    setBudget(range)
                    setShowBudget(false)
                  }}
                  className={cn(
                    "w-full px-4 py-3 text-left text-sm hover:bg-saffron-50 transition-colors",
                    budget.label === range.label && "bg-saffron-50 text-saffron-700 font-medium"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        size="lg"
        variant="gradient"
        className="w-full mt-6 h-14 text-base gap-2"
      >
        <Search className="w-5 h-5" />
        Search Vastu Properties
      </Button>

      {/* Quick filters */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {["East Facing", "North Facing", "Vastu Certified", "Ready to Move", "Under Construction"].map((filter) => (
          <button
            key={filter}
            className="px-3 py-1.5 text-xs font-medium text-earth-600 bg-white/60 hover:bg-white border border-earth-200 rounded-full transition-colors flex items-center gap-1"
          >
            <Compass className="w-3 h-3" />
            {filter}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
