"use client"

import { motion } from "framer-motion"
import { Home, Users, Building2, Compass } from "lucide-react"
import SearchBox from "@/components/property/SearchBox"
import { Badge } from "@/components/ui/badge"

const stats = [
  { icon: Home, value: "50,000+", label: "Vastu Properties" },
  { icon: Users, value: "10,000+", label: "Happy Families" },
  { icon: Building2, value: "500+", label: "Verified Builders" },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero text-white min-h-[600px] flex items-center">
      {/* Pattern overlay */}
      <div className="absolute inset-0 pattern-mandala opacity-30" />
      <div className="absolute inset-0 pattern-vastu" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-saffron-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-500/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge variant="vastu-compliant" className="mb-6 text-sm px-4 py-1.5">
              <Compass className="w-4 h-4 mr-2" />
              Vastu-Certified Properties
            </Badge>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Find Your{" "}
            <span className="relative">
              <span className="gradient-text-saffron">Sacred</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 8C50 2 150 2 198 8"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="200" y2="0">
                    <stop stopColor="#FF6B35" />
                    <stop offset="1" stopColor="#D4A853" />
                  </linearGradient>
                </defs>
              </svg>
            </span>{" "}
            Space
          </h1>

          <p className="text-lg md:text-xl text-earth-200 max-w-2xl mx-auto mb-8">
            Discover Vastu-compliant properties across India. Buy, sell, or rent your perfect home with authentic Vastu verification.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <SearchBox />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-8 mt-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-saffron-500/30 to-gold-500/30 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-saffron-300" />
              </div>
              <div>
                <p className="font-bold text-lg text-white">{stat.value}</p>
                <p className="text-sm text-earth-300">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
