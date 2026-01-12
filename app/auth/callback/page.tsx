"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get("code")

      if (!code) {
        router.replace("/login")
        return
      }

      try {
        const res = await fetch(
          `https://carbonscan-api.vercel.app/auth/callback?code=${code}`
        )

        const data = await res.json()

        if (!res.ok || !data.access_token) {
          throw new Error("Google login failed")
        }

        localStorage.setItem("access_token", data.access_token)
        router.replace("/dashboard")
      } catch (err) {
        console.error(err)
        router.replace("/login")
      }
    }

    handleCallback()
  }, [router])

  return <p>Login Google diproses...</p>
}
