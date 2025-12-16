"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agree, setAgree] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      router.push("/login")
      setIsLoading(false)
    }, 1000)
  }

  const handleGoogleRegister = async () => {
    setGoogleLoading(true)

    try {
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: false,
      })

      if (result?.error) {
        alert("Daftar dengan Google gagal. Coba lagi.")
        setGoogleLoading(false)
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch {
      alert("Terjadi kesalahan. Coba lagi.")
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#DFF5E3] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-20 h-20 mx-auto mb-4"
          />
        </div>

        {/* CARD */}
        <div className="bg-white rounded-[32px] shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-2">
            Daftar
          </h2>

          <p className="text-muted-foreground text-center mb-6">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Masuk
            </Link>
          </p>

          <form onSubmit={handleRegister} className="space-y-4">

            {/* NAMA */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D6A4F]" />
              <Input
                type="text"
                placeholder="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading || googleLoading}
                className="pl-12 border-2 border-[#2D6A4F]/40 focus:border-[#2D6A4F] focus:ring-0"
              />
            </div>

            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D6A4F]" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || googleLoading}
                className="pl-12 border-2 border-[#2D6A4F]/40 focus:border-[#2D6A4F] focus:ring-0"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D6A4F]" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || googleLoading}
                className="pl-12 pr-12 border-2 border-[#2D6A4F]/40 focus:border-[#2D6A4F] focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-[#2D6A4F]" />
                ) : (
                  <Eye className="w-5 h-5 text-[#2D6A4F]" />
                )}
              </button>
            </div>

            {/* AGREEMENT */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={agree}
                onCheckedChange={(checked) =>
                  setAgree(checked === true)
                }
                className="h-4 w-4 border-2 border-gray-400 bg-white
                  data-[state=checked]:bg-[#2D6A4F]
                  data-[state=checked]:border-[#2D6A4F]"
              />
              <span className="text-sm">
                Saya menyetujui syarat & ketentuan
              </span>
            </div>

            {/* BUTTON DAFTAR (TANPA LOADING TEXT) */}
            <Button
              type="submit"
              disabled={isLoading || googleLoading || !agree}
              className="w-full bg-[#2D6A4F] text-white py-4 mt-4"
            >
              Daftar
            </Button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-muted-foreground">Atau</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* GOOGLE REGISTER */}
          <button
            onClick={handleGoogleRegister}
            disabled={googleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="font-medium text-[#2D6A4F]">
              Daftar dengan Google
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
