"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Leaf, Trees } from "lucide-react"

import TopBar from "@/components/top-bar"
import Card from "@/components/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"


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
  useEffect(() => {
    document.body.classList.add("page-loading")
    return () => {
      document.body.classList.remove("page-loading")
    }
  }, [])

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
          `https://carbonscan-api.vercel.app/api/emission/${id}`,
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
        document.body.classList.remove("page-loading")
      }
    }

    fetchDetail()
  }, [id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <TopBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#254B37] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">Memuat detail emisi...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!data) return null

  // ===============================
  // CARBON OFFSET
  // ===============================
  const CARBON_OFFSET_RATE = 30 // Rp per kg CO₂e

  const carbonOffsetCost = Math.round(
    data.totalKarbon * CARBON_OFFSET_RATE
  )

  const OFFSET_PLATFORM_URL = "https://lindungihutan.com"

  const formatRupiah = (value: number) =>
    value.toLocaleString("id-ID")

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />

      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>

          {/* Summary Card */}
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Detail Emisi
                </h1>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(data.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Total Emisi Karbon
                    </p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {data.totalKarbon.toFixed(2)}
                      <span className="text-lg ml-1">kg CO₂e</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Products Table */}
          <Card className="overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Rincian Produk
              </h2>

              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Produk
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">
                        Emisi
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Kategori
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.details.map((d, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition">
                        <td className="py-4 px-4 text-gray-900">
                          {d.produk}
                        </td>
                        <td className="py-4 px-4 text-right font-medium text-emerald-600">
                          {d.emisi.toFixed(2)} kg
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {d.kategori}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-3">
                {data.details.map((d, i) => (
                  <div
                    key={i}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {d.produk}
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {d.kategori}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-emerald-600">
                      {d.emisi.toFixed(2)} kg CO₂e
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* ===============================
              CARBON OFFSET (NEW SECTION)
          =============================== */}
          <Card className="p-6 sm:p-8 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Trees className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500">
                  Estimasi Biaya Carbon Offset
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  Rp {formatRupiah(carbonOffsetCost)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Platform:{" "}
                  <Link
                    href={OFFSET_PLATFORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-emerald-600 hover:underline"
                  >
                    Lindungi Hutan
                  </Link>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}