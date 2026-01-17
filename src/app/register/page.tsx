"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Mail, Lock, Eye, EyeOff, User, Phone, Building2, Users, Briefcase, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from "@/components/brand/Logo"
import { cn } from "@/lib/utils"

const userTypes = [
  {
    id: "INDIVIDUAL",
    name: "Property Owner",
    description: "Buy, sell, or rent your property",
    icon: User,
    features: ["List unlimited properties", "Direct buyer contact", "Free basic listings"],
  },
  {
    id: "AGENT",
    name: "Agent / Broker",
    description: "Help clients find their dream homes",
    icon: Users,
    features: ["Agent profile page", "Client management", "Premium visibility"],
  },
  {
    id: "BUILDER",
    name: "Builder / Developer",
    description: "Showcase your projects to millions",
    icon: Building2,
    features: ["Project showcase", "Lead generation", "Brand visibility"],
  },
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "",
    companyName: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const selectUserType = (typeId: string) => {
    setFormData({ ...formData, userType: typeId })
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (formData.name.length < 2) {
      setError("Name must be at least 2 characters")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy")
      return
    }

    if (formData.userType === "BUILDER" && !formData.companyName) {
      setError("Company name is required for builders")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed. Please try again.")
      } else {
        router.push("/login?registered=true")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-mandala opacity-20" />
        <div className="absolute inset-0 pattern-vastu" />

        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <Logo variant="full" size="lg" linkToHome={true} />

          <div className="mt-12 space-y-8">
            <h1 className="text-4xl font-bold leading-tight">
              Find Your Perfect <br />
              <span className="gradient-text-gold">Vastu-Compliant</span> Home
            </h1>
            <p className="text-lg text-earth-200 max-w-md">
              Join thousands of happy families who found their sacred spaces through INFPSVaastu.
            </p>

            <div className="space-y-4 pt-6">
              {[
                "50,000+ Vastu-verified properties",
                "Expert Vastu consultants",
                "100% authentic listings",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-saffron-500/30 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-saffron-400" />
                  </div>
                  <span className="text-earth-200">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-saffron-500/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-48 h-48 bg-gold-500/20 rounded-full blur-3xl" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-earth-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Logo variant="full" size="md" />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-earth-900">Create Account</h2>
                  <p className="text-earth-600 mt-2">Select your account type to get started</p>
                </div>

                <div className="space-y-3">
                  {userTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectUserType(type.id)}
                      className={cn(
                        "w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all",
                        "hover:border-saffron-400 hover:bg-saffron-50",
                        formData.userType === type.id
                          ? "border-saffron-500 bg-saffron-50"
                          : "border-earth-200 bg-white"
                      )}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-saffron-100 to-gold-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <type.icon className="w-6 h-6 text-saffron-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-earth-900">{type.name}</p>
                        <p className="text-sm text-earth-500 mb-2">{type.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {type.features.map((feature, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-earth-100 text-earth-600 rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm text-earth-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-saffron-600 font-medium hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="p-2 hover:bg-earth-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-earth-600" />
                    </button>
                    <div>
                      <h2 className="text-xl font-bold text-earth-900">Create Account</h2>
                      <p className="text-sm text-earth-500">
                        Registering as {userTypes.find(t => t.id === formData.userType)?.name}
                      </p>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-earth-700">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
                      <Input
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {formData.userType === "BUILDER" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-earth-700">Company Name *</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
                        <Input
                          name="companyName"
                          placeholder="Enter your company name"
                          value={formData.companyName}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-earth-700">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-earth-700">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-earth-700">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (8+ characters)"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 pr-10"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-earth-500">Must be at least 8 characters</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-earth-700">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
                      <Input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 rounded border-earth-300 text-saffron-600 focus:ring-saffron-500"
                    />
                    <label htmlFor="terms" className="text-sm text-earth-600">
                      I agree to the{" "}
                      <Link href="/terms" className="text-saffron-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-saffron-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>

                  <p className="text-center text-sm text-earth-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-saffron-600 font-medium hover:underline">
                      Sign in
                    </Link>
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
