"use client"

import Link from "next/link"
import { Home, Upload, Clock, User } from "lucide-react"
import { usePathname } from "next/navigation"

interface BottomNavProps {
  active?: string
}

export default function BottomNav({ active }: BottomNavProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "dashboard") return pathname.includes("/dashboard")
    if (path === "upload") return pathname.includes("/upload")
    if (path === "history") return pathname.includes("/history")
    if (path === "profile") return pathname.includes("/profile")
    return false
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 shadow-2xl">
      <div className="flex justify-around items-center max-w-2xl mx-auto">
        <Link
          href="/dashboard"
          className={`flex-1 flex flex-col items-center justify-center py-4 px-3 transition-colors ${
            isActive("dashboard") ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Beranda</span>
        </Link>

        <Link
          href="/upload"
          className={`flex-1 flex flex-col items-center justify-center py-4 px-3 transition-colors ${
            isActive("upload") ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Upload</span>
        </Link>

        <Link
          href="/history"
          className={`flex-1 flex flex-col items-center justify-center py-4 px-3 transition-colors ${
            isActive("history") ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Riwayat</span>
        </Link>

        <Link
          href="/profile"
          className={`flex-1 flex flex-col items-center justify-center py-4 px-3 transition-colors ${
            isActive("profile") ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Profil</span>
        </Link>
      </div>
    </div>
  )
}
