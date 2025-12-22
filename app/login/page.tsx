"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Login gagal")
      }

      const data = await res.json()

      // ✅ SIMPAN DATA LOGIN
      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("user_id", data.user_id.toString())

      router.push("/dashboard")
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#DFF5E3] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-4xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            Login
          </Button>
        </form>

        <p className="text-center text-sm mt-4">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary underline">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  )
}
