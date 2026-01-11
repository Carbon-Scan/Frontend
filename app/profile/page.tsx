"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import TopBar from "@/components/top-bar"
import Card from "@/components/card"

type Profile = {
  id: string
  email: string
  name: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.replace("/login")
      return
    }

    fetch("http://localhost:4000/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setProfile)
      .catch(() => {
        localStorage.removeItem("access_token")
        router.replace("/login")
      })
  }, [router])

  if (!profile) return null

  const initial = profile.name
    ? profile.name.charAt(0).toUpperCase()
    : profile.email.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-[#E9F8EF] flex flex-col">
      <TopBar />

      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md rounded-3xl shadow-xl p-8 bg-white">

          {/* AVATAR */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-emerald-700 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
              {initial}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              {profile.name || "Pengguna"}
            </h2>
            <p className="text-sm text-gray-500">
              {profile.email}
            </p>
          </div>

          {/* INFO */}
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-sm text-gray-500">Email</span>
              <span className="font-medium text-gray-800">
                {profile.email}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-sm text-gray-500">Nama</span>
              <span className="font-medium text-gray-800">
                {profile.name || "-"}
              </span>
            </div>
          </div>

          {/* NOTE */}
          <div className="mt-6 bg-emerald-50 text-emerald-700 text-sm p-4 rounded-xl">
            Informasi profil diambil dari akun yang sedang login.
          </div>

        </Card>
      </main>
    </div>
  )
}
