"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agree, setAgree] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Register gagal")
      }

      alert("Register berhasil, silakan login")
      router.push("/login")
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#DFF5E3] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-4xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Daftar</h2>

        <form onSubmit={handleRegister} className="space-y-4">
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

          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={agree} onCheckedChange={(v) => setAgree(v === true)} />
            Setuju syarat & ketentuan
          </label>

          <Button type="submit" disabled={!agree || isLoading} className="w-full">
            Daftar
          </Button>
        </form>

        <p className="text-center text-sm mt-4">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
