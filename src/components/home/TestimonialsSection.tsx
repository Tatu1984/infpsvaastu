"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    avatar: null,
    rating: 5,
    text: "Found our dream home with perfect East-facing Vastu. The team's expertise in Vastu analysis made our decision so much easier. Highly recommend!",
  },
  {
    name: "Rajesh Kumar",
    location: "Bangalore",
    avatar: null,
    rating: 5,
    text: "The Vastu verification process was thorough and professional. We're living in a home that brings positive energy to our family every day.",
  },
  {
    name: "Anita Patel",
    location: "Delhi",
    avatar: null,
    rating: 5,
    text: "Exceptional service! They helped us find a Vastu-compliant office space that has transformed our business. The energy flow is remarkable.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-saffron-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-saffron-200/50 rounded-full blur-2xl" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-gold-200/50 rounded-full blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="gold" className="mb-4">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Testimonials
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-earth-900 mb-4">
            Stories from <span className="gradient-text-saffron">Happy Families</span>
          </h2>
          <p className="text-earth-600 max-w-2xl mx-auto">
            See what our customers say about finding their Vastu-compliant sacred spaces
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-earth-100 relative"
            >
              {/* Quote icon */}
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-saffron-500 to-gold-500 flex items-center justify-center shadow-lg">
                <Quote className="w-5 h-5 text-white" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 mt-2">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold-500 fill-gold-500" />
                ))}
              </div>

              {/* Text */}
              <p className="text-earth-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-earth-100">
                <Avatar fallback={testimonial.name} size="md" />
                <div>
                  <p className="font-semibold text-earth-900">{testimonial.name}</p>
                  <p className="text-sm text-earth-500">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
