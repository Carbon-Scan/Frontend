"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, LogOut, User } from "lucide-react"

type Profile = {
  name: string
  email: string
}

export default function TopBar() {
  const pathname = usePathname()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Unggah Struk", href: "/upload" },
    { label: "Riwayat", href: "/history" },
  ]

  /* ===============================
     FETCH PROFILE (SINGLE SOURCE)
  ================================ */
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    fetch("http://localhost:4000/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setProfile)
      .catch(() => setProfile(null))
  }, [])

  /* ===============================
     CLOSE DROPDOWN (OUTSIDE CLICK)
  ================================ */
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

  /* ===============================
     LOGOUT
  ================================ */
  const handleLogout = () => {
    localStorage.removeItem("access_token")
    setOpen(false)
    router.replace("/login")
    router.refresh()
  }

  const initial = profile
    ? (profile.name || profile.email).charAt(0).toUpperCase()
    : "?"

  return (
    <header className="w-full bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
        {/* LOGO */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <img src="/logo.png" alt="CarbonScan" className="w-8 h-8" />
          <span className="font-semibold text-emerald-700 text-lg">
            CarbonScan
          </span>
        </Link>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-10">
          {/* NAV */}
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

          {/* USER */}
          <div className="relative" ref={dropdownRef}>
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
                {/* HEADER */}
                <div className="px-4 py-3 bg-emerald-50">
                  <p className="font-semibold text-sm text-gray-800">
                    {profile.name || "Pengguna"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {profile.email}
                  </p>
                </div>

                {/* MENU */}
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

                {/* DIVIDER */}
                <div className="h-px bg-gray-200" />

                {/* LOGOUT */}
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
        </div>
      </div>
    </header>
  )
}
