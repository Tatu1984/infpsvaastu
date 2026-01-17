"use client"

import { motion } from "framer-motion"
import { Home, Users, Building2, MapPin } from "lucide-react"
import { AnimatedCounter } from "@/components/ui/animated-counter"

const stats = [
  {
    icon: Home,
    value: 50000,
    suffix: "+",
    label: "Vastu Properties",
    description: "Verified listings",
  },
  {
    icon: Users,
    value: 10000,
    suffix: "+",
    label: "Happy Families",
    description: "Trusted by customers",
  },
  {
    icon: Building2,
    value: 500,
    suffix: "+",
    label: "Verified Builders",
    description: "Premium partners",
  },
  {
    icon: MapPin,
    value: 100,
    suffix: "+",
    label: "Cities Covered",
    description: "Across India",
  },
]

export function StatsSection() {
  return (
    <section className="relative -mt-6 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-earth-100 p-6 md:p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-saffron-100 to-gold-100 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-saffron-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-earth-900">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    delay={index * 0.1}
                  />
                </div>
                <p className="font-medium text-earth-800 mt-1">{stat.label}</p>
                <p className="text-sm text-earth-500">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
