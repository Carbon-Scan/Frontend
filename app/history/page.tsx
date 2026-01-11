"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import TopBar from "@/components/top-bar"
import Card from "@/components/card"
import { Button } from "@/components/ui/button"

type HistoryItem = {
  id: string
  createdAt: string
  totalKarbon: number
}

export default function HistoryPage() {
  const router = useRouter()
  const [data, setData] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.replace("/login")
      return
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          "http://localhost:4000/api/emission/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) throw new Error("Unauthorized")

        const json = await res.json()
        setData(json)
      } catch {
        localStorage.removeItem("access_token")
        router.replace("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [router])

  if (loading) return null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />

      <main className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-xl font-bold">Riwayat Emisi</h1>

          {data.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada riwayat perhitungan emisi.
            </p>
          )}

          {data.map((h) => (
            <Card
              key={h.id}
              className="p-5 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">
                  {new Date(h.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total Emisi:{" "}
                  <span className="font-semibold text-green-600">
                    {Number(h.totalKarbon).toFixed(2)} kg CO₂e
                  </span>
                </p>
              </div>

              <Button
                onClick={() => router.push(`/history/${h.id}`)}
              >
                Lihat Detail
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
