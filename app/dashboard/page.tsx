"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import TopBar from "@/components/top-bar"
import Card from "@/components/card"

const COLORS = [
  "#EF4444",
  "#F59E0B",
  "#22C55E",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
]

export default function DashboardPage() {
  const router = useRouter()

  // =====================
  // STATE
  // =====================
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  const [totalEmisi, setTotalEmisi] = useState(0)
  const [monthlyEmissionData, setMonthlyEmissionData] = useState<any[]>([])
  const [categoryEmissionData, setCategoryEmissionData] = useState<any[]>([])

  // =====================
  // PASTIKAN CLIENT-SIDE
  // =====================
  useEffect(() => {
    setMounted(true)
  }, [])

  // =====================
  // AUTH + FETCH DASHBOARD
  // =====================
  useEffect(() => {
    if (!mounted) return

    const token = localStorage.getItem("access_token")

    if (!token) {
      router.replace("/login")
      return
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Unauthorized")

        const data = await res.json()

        setTotalEmisi(data.totalEmisi ?? 0)
        setMonthlyEmissionData(data.monthlyEmissionData ?? [])
        setCategoryEmissionData(data.categoryEmissionData ?? [])
      } catch (err) {
        console.error("Dashboard error:", err)
        localStorage.removeItem("access_token")
        router.replace("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [mounted, router])

  // =====================
  // LOADING GUARD
  // =====================
  if (!mounted || loading) return null

  // =====================
  // UI
  // =====================
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />

      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* TOTAL EMISI */}
          <Card className="rounded-3xl p-6">
            <h3 className="text-sm mb-2 text-gray-500">
              Total Emisi
            </h3>
            <div className="text-4xl font-bold text-emerald-700">
              {totalEmisi.toLocaleString("id-ID", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              kg CO₂e
            </div>
          </Card>

          {/* LINE CHART */}
          <Card className="rounded-3xl p-6">
            <h3 className="text-lg mb-4 font-semibold">
              Tren Emisi Bulanan
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyEmissionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(v: number) =>
                    `${v.toFixed(2)} kg CO₂e`
                  }
                />
                <Line
                  type="monotone"
                  dataKey="emisi"
                  stroke="#1A6B41"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* PIE CHART */}
          <Card className="rounded-3xl p-6">
            <h3 className="text-lg mb-4 font-semibold">
              Emisi per Kategori
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Legend />
                <Pie
                  data={categoryEmissionData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  minAngle={3}
                  paddingAngle={1}
                >
                  {categoryEmissionData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) =>
                    `${v.toFixed(2)} kg CO₂e`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

        </div>
      </main>
    </div>
  )
}
