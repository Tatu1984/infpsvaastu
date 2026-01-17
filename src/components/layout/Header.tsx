"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  Home,
  Search,
  Building2,
  Users,
  Briefcase,
  Heart,
  User,
  LogOut,
  ChevronDown,
  Plus,
  Settings,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import Logo from "@/components/brand/Logo"
import { cn } from "@/lib/utils"

export default function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigation = [
    { name: "Buy", href: "/search?type=SELL", icon: Home },
    { name: "Rent", href: "/search?type=RENT", icon: Search },
    { name: "PG", href: "/search?type=PG", icon: Building2 },
    { name: "Projects", href: "/projects", icon: Briefcase },
    { name: "Agents", href: "/agents", icon: Users },
    { name: "Builders", href: "/builders", icon: Building2 },
    { name: "Loans", href: "/loans", icon: CreditCard },
  ]

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-white"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Logo variant="full" size="md" />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-earth-600 hover:text-saffron-600 hover:bg-saffron-50 rounded-lg transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right side buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {session ? (
                <>
                  <Link href="/admin/properties/add">
                    <Button size="sm" variant="gradient" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Post Property
                    </Button>
                  </Link>
                  <Link href="/admin/shortlist">
                    <Button variant="ghost" size="icon" className="text-earth-600 hover:text-saffron-600">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </Link>
                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-earth-700 hover:bg-earth-50 rounded-lg transition-colors"
                    >
                      <Avatar
                        size="sm"
                        fallback={session.user?.name || "U"}
                      />
                      <span className="max-w-[100px] truncate hidden xl:block">
                        {session.user?.name}
                      </span>
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform",
                        userMenuOpen && "rotate-180"
                      )} />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setUserMenuOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-earth-100 py-2 z-50"
                          >
                            <div className="px-4 py-2 border-b border-earth-100">
                              <p className="text-sm font-medium text-earth-900 truncate">
                                {session.user?.name}
                              </p>
                              <p className="text-xs text-earth-500 truncate">
                                {session.user?.email}
                              </p>
                            </div>

                            <div className="py-1">
                              <Link
                                href="/admin"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-earth-700 hover:bg-saffron-50 hover:text-saffron-700"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <User className="w-4 h-4" />
                                My Dashboard
                              </Link>
                              <Link
                                href="/admin/properties"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-earth-700 hover:bg-saffron-50 hover:text-saffron-700"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <Home className="w-4 h-4" />
                                My Properties
                              </Link>
                              <Link
                                href="/admin/shortlist"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-earth-700 hover:bg-saffron-50 hover:text-saffron-700"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <Heart className="w-4 h-4" />
                                Shortlisted
                              </Link>
                              <Link
                                href="/admin/enquiries"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-earth-700 hover:bg-saffron-50 hover:text-saffron-700"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <Briefcase className="w-4 h-4" />
                                Inquiries
                              </Link>
                              {session.user?.userType === "ADMIN" && (
                                <Link
                                  href="/admin"
                                  className="flex items-center gap-3 px-4 py-2 text-sm text-earth-700 hover:bg-saffron-50 hover:text-saffron-700"
                                  onClick={() => setUserMenuOpen(false)}
                                >
                                  <Settings className="w-4 h-4" />
                                  Admin Panel
                                </Link>
                              )}
                            </div>

                            <div className="border-t border-earth-100 pt-1">
                              <button
                                onClick={() => {
                                  setUserMenuOpen(false)
                                  signOut()
                                }}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                              >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-earth-600">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="gradient">Register</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center gap-2">
              {session && (
                <Link href="/admin/shortlist">
                  <Button variant="ghost" size="icon-sm" className="text-earth-600">
                    <Heart className="w-5 h-5" />
                  </Button>
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-earth-700 hover:bg-earth-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="py-4 border-t border-earth-100">
                  <div className="space-y-1">
                    {navigation.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-3 text-base font-medium text-earth-700 hover:text-saffron-600 hover:bg-saffron-50 rounded-lg transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <item.icon className="w-5 h-5" />
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-earth-100 space-y-2">
                    {session ? (
                      <>
                        <div className="flex items-center gap-3 px-3 py-2 mb-2">
                          <Avatar fallback={session.user?.name || "U"} size="md" />
                          <div>
                            <p className="font-medium text-earth-900">{session.user?.name}</p>
                            <p className="text-sm text-earth-500">{session.user?.email}</p>
                          </div>
                        </div>
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full justify-start gap-2">
                            <User className="w-4 h-4" />
                            Dashboard
                          </Button>
                        </Link>
                        <Link href="/admin/properties/add" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="gradient" className="w-full justify-start gap-2">
                            <Plus className="w-4 h-4" />
                            Post Property
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => signOut()}
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full">Login</Button>
                        </Link>
                        <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="gradient" className="w-full">Register</Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-earth-200 z-50 safe-bottom">
        <div className="flex justify-around items-center h-16">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 px-3 py-2 text-earth-500 hover:text-saffron-600"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link
            href="/search"
            className="flex flex-col items-center gap-1 px-3 py-2 text-earth-500 hover:text-saffron-600"
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-medium">Search</span>
          </Link>
          <Link
            href="/admin/properties/add"
            className="flex flex-col items-center -mt-4"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-saffron-500 to-gold-500 flex items-center justify-center shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-medium text-earth-600 mt-1">Post</span>
          </Link>
          <Link
            href="/admin/shortlist"
            className="flex flex-col items-center gap-1 px-3 py-2 text-earth-500 hover:text-saffron-600"
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-medium">Saved</span>
          </Link>
          <Link
            href={session ? "/admin" : "/login"}
            className="flex flex-col items-center gap-1 px-3 py-2 text-earth-500 hover:text-saffron-600"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Account</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
