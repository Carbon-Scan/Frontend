"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import TopBar from "@/components/top-bar"
import Card from "@/components/card"
import { Button } from "@/components/ui/button"

type DetailItem = {
  produk: string
  emisi: number
  kategori: string
}

type EmissionDetail = {
  id: string
  totalKarbon: number
  createdAt: string
  details: DetailItem[]
}

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [data, setData] = useState<EmissionDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.replace("/login")
      return
    }

    const fetchDetail = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/emission/${id}`,
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

    fetchDetail()
  }, [id, router])

  if (loading) return null
  if (!data) return null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />

      <main className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-6">

          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            ← Kembali
          </Button>

          <Card className="p-6 space-y-2">
            <h1 className="text-xl font-bold">
              Detail Emisi
            </h1>
            <p className="text-sm text-muted-foreground">
              {new Date(data.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <p className="font-semibold text-green-600">
              Total Emisi: {data.totalKarbon.toFixed(2)} kg CO₂e
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-bold mb-4">
              Rincian Produk
            </h2>

            <table className="w-full text-sm border">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2">Produk</th>
                  <th className="text-right p-2">Emisi</th>
                  <th className="text-left p-2">Kategori</th>
                </tr>
              </thead>
              <tbody>
                {data.details.map((d, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{d.produk}</td>
                    <td className="p-2 text-right">
                      {d.emisi.toFixed(2)} kg
                    </td>
                    <td className="p-2">{d.kategori}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

        </div>
      </main>
    </div>
  )
}
