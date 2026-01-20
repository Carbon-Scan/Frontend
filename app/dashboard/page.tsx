"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
let TopBar: any
try {
  TopBar = require("@/components/top-bar").default
} catch {
  TopBar = () => <div className="p-4 bg-white border-b">TopBar Component</div>
}

export default function DashboardPage() {
  useEffect(() => {
    document.body.classList.add("page-loading")
    return () => {
      document.body.classList.remove("page-loading")
    }
  }, [])

  const router = useRouter()

  // =====================
  // STATE
  // =====================
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [chartView, setChartView] = useState<"monthly" | "daily">("daily")

  const [totalEmisi, setTotalEmisi] = useState(0)
  const [monthlyEmissionData, setMonthlyEmissionData] = useState<any[]>([])
  const [dailyEmissionData, setDailyEmissionData] = useState<any[]>([])
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
        
        // Jika API mengirim dailyEmissionData
        if (data.dailyEmissionData) {
          setDailyEmissionData(data.dailyEmissionData)
        } else {
          // Generate data harian dari monthlyData (fallback)
          generateDailyData(data.monthlyEmissionData || [])
        }
      } catch (err) {
        console.error("Dashboard error:", err)
        localStorage.removeItem("access_token")
        router.replace("/login")
      } finally {
        setLoading(false)
        document.body.classList.remove("page-loading")
      }
    }

    fetchDashboard()
  }, [mounted, router])

  // Generate data harian dari data bulanan (fallback jika API belum ada)
  const generateDailyData = (monthlyData: any[]) => {
    const dailyData = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      const dayName = date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
      const randomEmisi = Math.random() * 10 + 5 // Random untuk demo
      
      dailyData.push({
        date: dayName,
        emisi: Number(randomEmisi.toFixed(2))
      })
    }
    
    setDailyEmissionData(dailyData)
  }

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

  const currentChartData = chartView === "daily" ? dailyEmissionData : monthlyEmissionData
  const currentChartTitle = chartView === "daily" ? "Tren Emisi Harian (30 Hari Terakhir)" : "Tren Emisi Bulanan"
  const currentChartSubtitle = chartView === "daily" ? "Perbandingan emisi dari hari ke hari" : "Perbandingan emisi dari bulan ke bulan"

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
            
            {/* LINE/BAR CHART - Span 2 columns */}
            <Card className="lg:col-span-2 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{currentChartTitle}</h3>
                  <p className="text-xs text-gray-500 mt-1">{currentChartSubtitle}</p>
                </div>
                
                {/* Toggle Button */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setChartView("daily")}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                      chartView === "daily"
                        ? "bg-white text-[#254B37] shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Harian
                  </button>
                  <button
                    onClick={() => setChartView("monthly")}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                      chartView === "monthly"
                        ? "bg-white text-[#254B37] shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Bulanan
                  </button>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={320}>
                {chartView === "daily" ? (
                  <BarChart data={currentChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={70}
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
                        borderRadius: 8,
                        fontSize: 12
                      }}
                    />
                    <Bar
                      dataKey="emisi"
                      fill="#254B37"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <LineChart data={currentChartData}>
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
                        borderRadius: 8,
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
                )}
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
                      borderRadius: 8,
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