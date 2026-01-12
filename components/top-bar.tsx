"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, LogOut, User, Menu, X } from "lucide-react"

type Profile = {
  name: string
  email: string
}

export default function TopBar() {
  const pathname = usePathname()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Unggah Struk", href: "/upload" },
    { label: "Riwayat", href: "/history" },
  ]

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    fetch("https://carbonscan-api.vercel.app/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setProfile)
      .catch(() => setProfile(null))
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    setOpen(false)
    setMobileMenuOpen(false)
    router.replace("/login")
    router.refresh()
  }

  const initial = profile
    ? (profile.name || profile.email).charAt(0).toUpperCase()
    : "?"

  return (
    <header className="w-full bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <img src="/logo.png" alt="CarbonScan" className="w-8 h-8" />
          <span className="font-semibold text-emerald-700 text-lg">
            CarbonScan
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${
                  active
                    ? "text-emerald-700"
                    : "text-gray-600 hover:text-emerald-600"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop User Dropdown */}
        <div className="hidden md:block relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-semibold shadow">
              {initial}
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && profile && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden">
              <div className="px-4 py-3 bg-emerald-50">
                <p className="font-semibold text-sm text-gray-800">
                  {profile.name || "Pengguna"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {profile.email}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User className="w-4 h-4" />
                  Profil
                </Link>
              </div>

              <div className="h-px bg-gray-200" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-emerald-600"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3">
            {profile && (
              <div className="flex items-center gap-3 pb-4 mb-4 border-b">
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-semibold">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800">
                    {profile.name || "Pengguna"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {profile.email}
                  </p>
                </div>
              </div>
            )}

            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}

              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <User className="w-4 h-4" />
                Profil
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}