"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import GoogleButton from "@/components/google-button"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    setTimeout(() => {
      router.push("/dashboard")
      setIsLoading(false)
    }, 1000)
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    try {
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: false
      })
      
      if (result?.error) {
        console.error("Google login error:", result.error)
        alert("Login dengan Google gagal. Coba lagi.")
        setGoogleLoading(false)
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      alert("Terjadi kesalahan. Coba lagi.")
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4 mx-auto">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">CarbonScan</h1>
        </div>

        <div className="bg-card rounded-3xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Login</h2>
          <p className="text-muted-foreground mb-6">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Daftar
            </Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 rounded-2xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground"
                disabled={isLoading || googleLoading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 pr-12 rounded-2xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground"
                disabled={isLoading || googleLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading || googleLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  checked={rememberMe} 
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading || googleLoading}
                />
                <span className="text-sm text-foreground">Ingat saya</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Lupa Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading || googleLoading}
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 h-auto mt-6"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Loading...
                </div>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Masuk
                </>
              )}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-muted-foreground">Atau</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <div onClick={handleGoogleLogin}>
            <GoogleButton disabled={googleLoading || isLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}