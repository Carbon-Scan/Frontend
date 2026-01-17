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
  BarChart,
  Bar,
} from "recharts"

const COLORS = [
  "#EF4444",
  "#F59E0B",
  "#22C55E",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
]

// Komponen Card sederhana
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

// Import TopBar dari komponen yang sudah ada
// Jika ada error, ganti dengan: function TopBar() { return <div>TopBar</div> }
let TopBar: any
try {
  TopBar = require("@/components/top-bar").default
} catch {
  TopBar = () => <div className="p-4 bg-white border-b">TopBar Component</div>
}

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
        const res = await fetch("https://carbonscan-api.vercel.app/api/dashboard", {
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
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#254B37] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }
  // Hitung statistik tambahan
  const avgEmisi = monthlyEmissionData.length > 0 
    ? monthlyEmissionData.reduce((sum, item) => sum + item.emisi, 0) / monthlyEmissionData.length 
    : 0
  
  const maxEmisi = monthlyEmissionData.length > 0
    ? Math.max(...monthlyEmissionData.map(item => item.emisi))
    : 0

  const totalKategori = categoryEmissionData.length

  // =====================
  // UI
  // =====================
  return (
    <div className="min-h-screen bg-[#E9F8EF] flex flex-col">
      <TopBar />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Emisi */}
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                Total Emisi
              </h3>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {totalEmisi.toLocaleString("id-ID", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-gray-600">kg CO₂e</p>
            </Card>

            {/* Rata-rata Bulanan */}
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                Rata-rata Bulanan
              </h3>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {avgEmisi.toLocaleString("id-ID", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-gray-600">kg CO₂e</p>
            </Card>

            {/* Emisi Tertinggi */}
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                Emisi Tertinggi
              </h3>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {maxEmisi.toLocaleString("id-ID", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-gray-600">kg CO₂e</p>
            </Card>

            {/* Total Kategori */}
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                Kategori Aktif
              </h3>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {totalKategori}
              </div>
              <p className="text-xs text-gray-600">kategori</p>
            </Card>

          </div>

          {/* CHARTS */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* LINE CHART - Span 2 columns */}
            <Card className="lg:col-span-2 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Tren Emisi Bulanan</h3>
                  <p className="text-xs text-gray-500 mt-1">Perbandingan emisi dari bulan ke bulan</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={monthlyEmissionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(v: number) => [`${v.toFixed(2)} kg CO₂e`, 'Emisi']}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: 0,
                      fontSize: 12
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="emisi"
                    stroke="#254B37"
                    strokeWidth={3}
                    dot={{ fill: '#254B37', r: 5 }}
                    activeDot={{ r: 7, fill: '#1d3a2a' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* PIE CHART */}
            <Card className="p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Distribusi Kategori</h3>
                <p className="text-xs text-gray-500 mt-1">Komposisi emisi per kategori</p>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={categoryEmissionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    minAngle={3}
                    paddingAngle={2}
                  >
                    {categoryEmissionData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => `${v.toFixed(2)} kg CO₂e`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: 0,
                      fontSize: 12
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>

          </div>

        </div>
      </main>
    </div>
  )
}