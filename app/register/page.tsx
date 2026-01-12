"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(
        "https://carbonscan-api.vercel.app/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || "Registrasi gagal")
        return
      }

      alert("Registrasi berhasil, silakan login")
      router.push("/login")
    } catch {
      alert("Server error")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = () => {
    setGoogleLoading(true)

    // 🔑 REGISTER GOOGLE = LOGIN GOOGLE
    window.location.href =
      "https://carbonscan-api.vercel.app/api/auth/login/google"
  }

  return (
    <div className="min-h-screen bg-[#E9F8EF] flex flex-col items-center justify-center px-4">
      
      {/* LOGO */}
      <div className="flex flex-col items-center mb-6">
        <img
          src="/logo.png"
          alt="CarbonScan"
          className="w-14 h-14 mb-2"
        />
        <h1 className="text-xl font-semibold text-emerald-800">
          CarbonScan
        </h1>
      </div>

      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-emerald-900 mb-2">
          Daftar Akun
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-emerald-600 font-medium">
            Masuk
          </Link>
        </p>

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-4">

          {/* NAMA */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Nama"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* BUTTON DAFTAR */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 text-white py-3 rounded-xl font-semibold hover:bg-emerald-800 transition disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-400">Atau</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* GOOGLE REGISTER */}
        <button
          onClick={handleGoogleRegister}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 hover:bg-gray-50 transition disabled:opacity-60"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          <span className="font-medium text-emerald-700">
            {googleLoading ? "Menghubungkan..." : "Daftar dengan Google"}
          </span>
        </button>
      </div>
    </div>
  )
}
