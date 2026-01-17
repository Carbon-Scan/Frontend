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

// GANTI dengan BASE URL BACKEND kamu
const API_BASE = "https://carbonscan-api.vercel.app/api"

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)

  // ULASAN STATE
  const [showReview, setShowReview] = useState(false)
  const [review, setReview] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.replace("/login")
      return
    }

    fetch(`${API_BASE}/profile`, {
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

      const initial =
  profile.name?.trim()?.charAt(0)?.toUpperCase() ||
  profile.email?.charAt(0)?.toUpperCase() ||
  "?"



  // ================= SUBMIT ULASAN =================
  const submitReview = async () => {
    if (!review.trim()) {
      alert("Ulasan tidak boleh kosong")
      return
    }

    const token = localStorage.getItem("access_token")
    if (!token) {
      router.replace("/login")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          review_text: review,
        }),
      })

      if (!res.ok) throw new Error("Gagal kirim ulasan")

      alert("Terima kasih atas ulasan Anda 🙏")
      setReview("")
      setShowReview(false)
    } catch (err) {
      alert("Terjadi kesalahan saat mengirim ulasan")
    } finally {
      setLoading(false)
    }
  }

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

          {/* BUTTON TAMBAH ULASAN */}
          {!showReview && (
            <button
              onClick={() => setShowReview(true)}
              className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium transition"
            >
              Tambahkan Ulasan
            </button>
          )}

          {/* FORM ULASAN */}
          {showReview && (
            <div className="mt-4 bg-gray-50 border rounded-xl p-4">
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tulis ulasan Anda tentang aplikasi CarbonScan..."
                className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={4}
                disabled={loading}
              />

              <div className="flex gap-2 mt-3">
                <button
                  onClick={submitReview}
                  disabled={loading}
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm disabled:opacity-60"
                >
                  {loading ? "Mengirim..." : "Kirim"}
                </button>

                <button
                  onClick={() => {
                    setReview("")
                    setShowReview(false)
                  }}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

        </Card>
      </main>
    </div>
  )
}
