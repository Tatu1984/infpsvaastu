"use client"

import { motion } from "framer-motion"
import { Shield, Clock, TrendingUp, Compass, CheckCircle, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    icon: Shield,
    title: "Vastu Verified",
    description: "All properties undergo authentic Vastu verification by certified experts",
    color: "saffron",
  },
  {
    icon: Compass,
    title: "Direction Analysis",
    description: "Detailed analysis of property orientation and energy flow patterns",
    color: "gold",
  },
  {
    icon: Clock,
    title: "Quick Response",
    description: "Get responses from property owners within 24 hours of inquiry",
    color: "saffron",
  },
  {
    icon: TrendingUp,
    title: "Best Prices",
    description: "Compare prices and find the best deals in your preferred location",
    color: "gold",
  },
  {
    icon: CheckCircle,
    title: "Legal Verified",
    description: "Complete legal documentation check and verification for peace of mind",
    color: "saffron",
  },
  {
    icon: Star,
    title: "Premium Support",
    description: "Dedicated support team to guide you through your property journey",
    color: "gold",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-earth-900 to-earth-950 text-white relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 pattern-mandala opacity-10" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-saffron-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="vastu-compliant" className="mb-4">
            <Star className="w-3 h-3 mr-1" />
            Why Choose Us
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The <span className="gradient-text-saffron">Sacred</span> Advantage
          </h2>
          <p className="text-earth-300 max-w-2xl mx-auto">
            We make finding your Vastu-compliant dream home simple, authentic, and trustworthy
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-saffron-500/30 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center ${
                  feature.color === "saffron"
                    ? "bg-gradient-to-br from-saffron-500/20 to-saffron-600/20"
                    : "bg-gradient-to-br from-gold-400/20 to-gold-500/20"
                }`}
              >
                <feature.icon
                  className={`w-7 h-7 ${
                    feature.color === "saffron" ? "text-saffron-400" : "text-gold-400"
                  }`}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-saffron-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-earth-400">{feature.description}</p>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-saffron-500/0 to-gold-500/0 group-hover:from-saffron-500/5 group-hover:to-gold-500/5 transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
