"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from "@/components/brand/Logo"

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
]

const propertyTypes = [
  "Apartments", "Houses & Villas", "Plots", "Commercial",
  "PG/Roommates", "Builder Projects"
]

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "FAQs", href: "/faq" },
  { name: "News & Articles", href: "/news" },
  { name: "Home Loans", href: "/loans" },
  { name: "Find Agents", href: "/agents" },
  { name: "Top Builders", href: "/builders" },
]

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
]

export default function Footer() {
  return (
    <footer className="bg-earth-900 text-earth-300 lg:mb-0 mb-16">
      {/* City Links Section */}
      <div className="border-b border-earth-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5 text-saffron-500" />
            Vastu Properties by City
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {cities.map((city) => (
              <Link
                key={city}
                href={`/search?city=${city}`}
                className="text-sm hover:text-saffron-400 transition-colors"
              >
                Properties in {city}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Logo variant="full" size="lg" linkToHome={true} />
            <p className="text-sm text-earth-400 mt-4">
              Your trusted partner in finding Vastu-compliant properties.
              We connect buyers, sellers, and renters across India with authentic Vastu verification.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-earth-800 flex items-center justify-center hover:bg-saffron-500 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-white font-semibold mb-4">Property Types</h3>
            <ul className="space-y-2">
              {propertyTypes.map((type) => (
                <li key={type}>
                  <Link
                    href={`/search?propertyType=${type}`}
                    className="text-sm hover:text-saffron-400 transition-colors inline-flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-saffron-500" />
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-saffron-400 transition-colors inline-flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-saffron-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  123 Sacred Spaces Tower,<br />
                  Business District, Mumbai 400001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-saffron-500" />
                <span className="text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-saffron-500" />
                <span className="text-sm">contact@infpsvaastu.com</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-white font-medium mb-3">Subscribe to Newsletter</h4>
              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-earth-800 border-earth-700 text-white placeholder:text-earth-500 focus:ring-saffron-500"
                />
                <Button type="submit" variant="gradient" size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Vastu Tip */}
      <div className="border-t border-earth-800 bg-earth-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 text-sm text-earth-400">
            <span className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gradient-to-r from-saffron-500 to-gold-500 flex items-center justify-center text-white text-xs font-bold">
                V
              </span>
              <span className="text-earth-300">Vastu Tip:</span>
            </span>
            <span className="italic">
              &quot;East-facing properties bring positive energy and prosperity. Always check the main entrance direction.&quot;
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-earth-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-earth-500">
              &copy; {new Date().getFullYear()} INFPSVaastu. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-saffron-400 transition-colors text-earth-400">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-saffron-400 transition-colors text-earth-400">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
