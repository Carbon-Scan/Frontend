"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return

    setLoading(true)
    setError("")

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      )

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
      }

      router.push("/admin")
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border-4 border-emerald-600 p-8">

        <h1 className="text-3xl font-bold mb-2">Log in.</h1>
        <p className="text-gray-500 mb-6">Login with admin credentials</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="admin@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          disabled={loading}
          className="w-full mb-4 px-5 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
        />

        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          disabled={loading}
          className="w-full mb-6 px-5 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
        />

        <button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
          Don’t have an account? <br />
          only our side can access! <span className="text-emerald-600 font-medium">https://carbonscanemisi.vercel.app/</span>
        </div>

      </div>
    </div>
  )
}
