"use client"

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import TopBar from "@/components/top-bar"
import BottomNav from "@/components/bottom-nav"
import Card from "@/components/card"

const monthlyEmissionData = [
  { month: "Jan", emisi: 1200 },
  { month: "Feb", emisi: 1400 },
  { month: "Mar", emisi: 1100 },
  { month: "Apr", emisi: 1500 },
  { month: "May", emisi: 1800 },
  { month: "Jun", emisi: 1450 },
  { month: "Jul", emisi: 2100 },
  { month: "Aug", emisi: 1950 },
  { month: "Sep", emisi: 1750 },
  { month: "Oct", emisi: 1600 },
  { month: "Nov", emisi: 1900 },
  { month: "Dec", emisi: 2200 },
]

const categoryEmissionData = [
  { name: "Transportasi", value: 4500 },
  { name: "Energi", value: 3200 },
  { name: "Makanan", value: 2100 },
  { name: "Lainnya", value: 1650 },
]

const COLORS = ["#1A6B41", "#2D8B5F", "#0D4A2F", "#3DAA6F"]

export default function DashboardPage() {
  const totalEmisi = 12450

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <TopBar />

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <Card className="bg-card rounded-3xl shadow-md p-6 border border-border/50">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Total Emisi Bulan Ini</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-blue-600">{totalEmisi.toLocaleString()}</span>
            <span className="text-muted-foreground">kg CO₂</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">↑ 5% dari bulan lalu</p>
        </Card>

        <Card className="bg-card rounded-3xl shadow-md p-6 border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Tren Emisi Bulanan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyEmissionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D0E8E0" />
              <XAxis dataKey="month" stroke="#1A6B41" />
              <YAxis stroke="#1A6B41" />
              <Tooltip
                contentStyle={{ backgroundColor: "#E7F5EC", border: "1px solid #D0E8E0" }}
                cursor={{ fill: "#E8F4F0" }}
              />
              <Line type="monotone" dataKey="emisi" stroke="#1A6B41" dot={{ fill: "#1A6B41" }} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card className="bg-card rounded-3xl shadow-md p-6 border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Emisi per Kategori Bahan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryEmissionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#1A6B41"
                dataKey="value"
              >
                {categoryEmissionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#E7F5EC", border: "1px solid #D0E8E0" }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </main>

      <BottomNav active="dashboard" />
    </div>
  )
}
