"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"

// Import komponen yang sudah ada
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
  
  // Filter state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.replace("/login")
      return
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          "https://carbonscan-api.vercel.app/api/emission/history",
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

  // Filter data based on selected date
  const filteredData = useMemo(() => {
    if (!selectedDate) return data

    return data.filter(item => {
      const itemDate = new Date(item.createdAt)
      return (
        itemDate.getDate() === selectedDate.getDate() &&
        itemDate.getMonth() === selectedDate.getMonth() &&
        itemDate.getFullYear() === selectedDate.getFullYear()
      )
    })
  }, [data, selectedDate])

  // Get dates that have data
  const datesWithData = useMemo(() => {
    const dates = new Set<string>()
    data.forEach(item => {
      const date = new Date(item.createdAt)
      dates.add(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)
    })
    return dates
  }, [data])

  // Calendar logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay()

    return { daysInMonth, startDayOfWeek, year, month }
  }

  const { daysInMonth, startDayOfWeek, year, month } = getDaysInMonth(currentMonth)

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1))
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day)
    if (selectedDate && 
        clickedDate.getDate() === selectedDate.getDate() &&
        clickedDate.getMonth() === selectedDate.getMonth() &&
        clickedDate.getFullYear() === selectedDate.getFullYear()) {
      setSelectedDate(null)
    } else {
      setSelectedDate(clickedDate)
    }
  }

  const hasDataOnDate = (day: number) => {
    const dateKey = `${year}-${month}-${day}`
    return datesWithData.has(dateKey)
  }

  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    )
  }

  const totalEmisiFiltered = filteredData.reduce((sum, item) => sum + Number(item.totalKarbon), 0)

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]

  const dayNames = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#254B37] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Memuat riwayat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E9F8EF] flex flex-col">
      <TopBar />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left Side - History List */}
            <div className="lg:col-span-2 space-y-4">

              {/* Summary Card */}
              {filteredData.length > 0 && (
                <Card className="p-6 bg-linear-to-br from-[#254B37] to-[#1d3a2a] text-white">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs opacity-90 mb-1">Total Perhitungan</p>
                      <p className="text-2xl md:text-3xl font-bold">{filteredData.length}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {selectedDate ? "dari tanggal dipilih" : "dari semua waktu"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs opacity-90 mb-1">Total Emisi</p>
                      <p className="text-2xl md:text-3xl font-bold">
                        {totalEmisiFiltered.toFixed(2)}
                      </p>
                      <p className="text-xs opacity-90">kg CO₂e</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Empty State */}
              {filteredData.length === 0 && data.length === 0 && (
                <Card className="p-12 text-center">
                  <div className="max-w-sm mx-auto">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">📋</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Belum Ada Riwayat
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Anda belum melakukan perhitungan emisi karbon. Mulai sekarang dengan mengunggah struk belanja Anda.
                    </p>
                    <Button
                      onClick={() => router.push("/upload")}
                      className="bg-[#254B37] text-white hover:bg-[#1d3a2a] px-6 py-2 rounded-lg font-medium"
                    >
                      Mulai Upload
                    </Button>
                  </div>
                </Card>
              )}

              {/* Empty State - Filtered */}
              {filteredData.length === 0 && data.length > 0 && (
                <Card className="p-12 text-center">
                  <div className="max-w-sm mx-auto">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">🔍</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Tidak Ada Data
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Tidak ada riwayat untuk tanggal yang dipilih.
                    </p>
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="text-[#254B37] hover:underline font-medium"
                    >
                      Lihat Semua Data
                    </button>
                  </div>
                </Card>
              )}

              {/* History List */}
              {filteredData.length > 0 && (
                <div className="space-y-3">
                  {filteredData.map((h) => (
                    <Card
                      key={h.id}
                      className="p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm md:text-base font-bold text-gray-900 mb-1">
                            {new Date(h.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs md:text-sm text-gray-600">
                            Total Emisi:{" "}
                            <span className="font-bold text-green-600">
                              {Number(h.totalKarbon).toFixed(2)} kg CO₂e
                            </span>
                          </p>
                        </div>
                        <Button
                          onClick={() => router.push(`/history/${h.id}`)}
                          className="bg-[#254B37] text-white hover:bg-[#1d3a2a] px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
                        >
                          Detail
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {filteredData.length > 0 && (
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-500">
                    Menampilkan {filteredData.length} dari {data.length} riwayat
                  </p>
                </div>
              )}

            </div>

            {/* Right Side - Calendar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-6">
                <Card className="p-4 bg-gray-800 text-white">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={handlePrevMonth}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded"
                    >
                      ‹
                    </button>
                    <div className="text-center">
                      <p className="font-bold text-sm">{monthNames[month]} {year}</p>
                    </div>
                    <button
                      onClick={handleNextMonth}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded"
                    >
                      ›
                    </button>
                  </div>

                  {/* Day Names */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map(day => (
                      <div key={day} className="text-center text-xs font-medium opacity-60 py-1">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: startDayOfWeek }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1
                      const hasData = hasDataOnDate(day)
                      const isSelected = isSelectedDate(day)

                      return (
                        <button
                          key={day}
                          onClick={() => handleDateClick(day)}
                          className={`
                            aspect-square flex items-center justify-center text-sm rounded
                            transition-all
                            ${hasData ? 'font-bold' : 'opacity-60'}
                            ${isSelected 
                              ? 'bg-orange-500 text-white' 
                              : hasData 
                                ? 'hover:bg-gray-700' 
                                : 'hover:bg-gray-700'
                            }
                          `}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>

                  {/* Legend */}
                  <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-6 h-6 rounded bg-orange-500"></div>
                      <span className="opacity-75">Tanggal dipilih</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-6 h-6 rounded font-bold flex items-center justify-center bg-gray-700">15</div>
                      <span className="opacity-75">Ada data</span>
                    </div>
                  </div>

                  {selectedDate && (
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium"
                    >
                      Reset Filter
                    </button>
                  )}
                </Card>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  )
}