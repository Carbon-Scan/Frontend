"use client"

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

/* ================= DATA ================= */

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
  { name: "Daging & Hewani", value: 4500 },
  { name: "Bahan Pokok", value: 3000 },
  { name: "Sayur & Buah", value: 2500 },
]

const COLORS = ["#EF4444", "#F59E0B", "#22C55E"]

/* ================= PAGE ================= */

export default function DashboardPage() {
  const totalEmisi = 12450

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* TOP BAR */}
      <TopBar />

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* TOTAL EMISI */}
          <Card className="bg-card rounded-3xl shadow-md p-6 border border-border/50">
            <h3 className="text-muted-foreground text-sm font-medium mb-2">
              Total Emisi Bulan Ini
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-600">
                {totalEmisi.toLocaleString()}
              </span>
              <span className="text-muted-foreground">kg CO₂</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              ↑ 5% dari bulan lalu
            </p>
          </Card>

          {/* LINE CHART */}
          <Card className="bg-card rounded-3xl shadow-md p-6 border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Tren Emisi Bulanan
            </h3>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyEmissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D0E8E0" />
                <XAxis dataKey="month" stroke="#1A6B41" />
                <YAxis stroke="#1A6B41" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#E7F5EC",
                    border: "1px solid #D0E8E0",
                  }}
                  cursor={{ fill: "#E8F4F0" }}
                />
                <Line
                  type="monotone"
                  dataKey="emisi"
                  stroke="#1A6B41"
                  dot={{ fill: "#1A6B41" }}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* PIE CHART */}
          <Card className="bg-card rounded-3xl shadow-md p-6 border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Emisi per Kategori Bahan
            </h3>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                {/* LEGEND ATAS */}
                <Legend
                  verticalAlign="top"
                  align="center"
                  layout="horizontal"
                  iconType="rect"
                />

                <Pie
                  data={categoryEmissionData}
                  cx="50%"
                  cy="60%"
                  outerRadius={110}
                  dataKey="value"
                  labelLine={false}
                >
                  {categoryEmissionData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value: number) => [
                    `${value} kg CO₂`,
                    "Emisi",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

        </div>
      </main>
    </div>
  )
}
