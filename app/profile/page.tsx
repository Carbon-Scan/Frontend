"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { User, Eye, EyeOff } from "lucide-react"

import TopBar from "@/components/top-bar"
import Card from "@/components/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  /* ================= HOOKS ================= */
  const { data: session, status } = useSession()

  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const email = session?.user?.email || "-"
  const avatar =
    session?.user?.image ||
    "https://api.dicebear.com/7.x/avataaars/svg?seed=user"

  // Nama di bawah avatar → dari email
  const displayName =
    email !== "-" ? email.split("@")[0] : "Pengguna"

  const initialUsername = displayName

  const [username, setUsername] = useState(initialUsername)
  const [password, setPassword] = useState("")

  /* ================= CONDITIONAL ================= */
  if (status === "loading") {
    return <p className="p-4 text-center">Memuat...</p>
  }

  if (!session) {
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
    return null
  }

  /* ================= HANDLERS ================= */
  const handleSave = () => {
    // TODO: kirim ke backend (username & password)
    setIsEditing(false)
    setPassword("")
    setShowPassword(false)
  }

  const handleCancel = () => {
    setUsername(initialUsername)
    setPassword("")
    setShowPassword(false)
    setIsEditing(false)
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />

      <main className="flex-1 p-4 max-w-3xl mx-auto w-full space-y-4">
        {/* PROFILE CARD */}
        <Card className="bg-card rounded-3xl shadow-md p-6 border border-border/50">
          {/* HEADER */}
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="w-24 h-24 mb-4 border-4 border-background shadow-lg">
              <AvatarImage src={avatar} />
              <AvatarFallback>
                <User className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>

            <h2 className="text-xl font-bold text-foreground">
              {displayName}
            </h2>
            <p className="text-muted-foreground">{email}</p>
          </div>

          {/* FORM */}
          <div className="space-y-5">
            {/* USERNAME */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Username
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditing}
                placeholder="Masukkan username"
              />
            </div>

            {/* EMAIL (READ ONLY) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input value={email} disabled />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={!isEditing}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    isEditing
                      ? "Masukkan password baru"
                      : "••••••••"
                  }
                  className="pr-10"
                />

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* ACTION BUTTONS */}
        <div className="space-y-3">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Edit Profil
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSave}
                className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Simpan Profil
              </Button>

              <Button
                onClick={handleCancel}
                className="w-full rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
              >
                Batal
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
