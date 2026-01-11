"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Ambil token dari URL hash
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)

    const accessToken = params.get("access_token")

    if (!accessToken) {
      router.replace("/login")
      return
    }

    // 🔥 SIMPAN TOKEN
    localStorage.setItem("access_token", accessToken)

    // 🔁 Redirect ke dashboard
    router.replace("/dashboard")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
      Menghubungkan akun Google...
    </div>
  )
}
