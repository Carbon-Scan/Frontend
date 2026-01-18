"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    // Ambil access_token dari URL (#access_token=...)
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get("access_token")

    if (!accessToken) {
      router.replace("/login")
      return
    }

    // SIMPAN TOKEN (backend kamu yang pakai)
    localStorage.setItem("access_token", accessToken)

    // Masuk dashboard
    router.replace("/dashboard")
  }, [])

  return <p>Login Google berhasil...</p>
}
