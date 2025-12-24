"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Download, Calendar, User } from "lucide-react"

export default function HistoryPage() {
  const router = useRouter()
  const [isDownloading, setIsDownloading] = useState(false)
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [histories, setHistories] = useState<any[]>([])
  const [filteredHistories, setFilteredHistories] = useState<any[]>([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    const id = localStorage.getItem("user_id")
    if (!id) {
      router.push("/login")
      return
    }
    setUserId(id)
    fetchData(id)
  }, [])

  useEffect(() => {
    filterHistories()
  }, [startDate, endDate, histories])

  const fetchData = async (id: string) => {
    try {
      // Ambil nama user
      const userRes = await fetch(`http://127.0.0.1:8000/user/${id}`)
      const userData = await userRes.json()
      setUserName(userData.nama || "User")

      // Ambil riwayat
      const listRes = await fetch(`http://127.0.0.1:8000/riwayat/${id}`)
      const riwayat = await listRes.json()
      
      if (Array.isArray(riwayat)) {
        setHistories(riwayat)
        setFilteredHistories(riwayat)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filterHistories = () => {
    if (!startDate && !endDate) {
      setFilteredHistories(histories)
      return
    }

    const filtered = histories.filter((h) => {
      const hDate = new Date(h.tanggal)
      const start = startDate ? new Date(startDate) : null
      const end = endDate ? new Date(endDate) : null

      if (start && end) {
        return hDate >= start && hDate <= end
      } else if (start) {
        return hDate >= start
      } else if (end) {
        return hDate <= end
      }
      return true
    })

    setFilteredHistories(filtered)
  }

  const downloadPDF = async (strukId: string) => {
    setIsDownloading(true)

    try {
      const detailRes = await fetch(
        `http://127.0.0.1:8000/riwayat/detail/${strukId}`
      )
      const data = await detailRes.json()

      const { default: jsPDF } = await import("jspdf")
      const { default: autoTable } = await import("jspdf-autotable")

      const doc = new jsPDF()

      // Header
      doc.setFillColor(0, 102, 51)
      doc.rect(0, 0, 210, 35, "F")
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(18)
      doc.text("LAPORAN EMISI KARBON", 105, 15, { align: "center" })
      
      doc.setFontSize(9)
      doc.text(userName, 105, 22, { align: "center" })

      // Info
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.text(`Struk ID: ${data.struk_id}`, 14, 45)
      doc.text(
        `Tanggal: ${new Date().toLocaleDateString("id-ID")}`,
        14,
        50
      )

      // Table
      const tableBody = data.produk
        .filter((p: any) => p.berat_kg > 0)
        .map((p: any, idx: number) => [
          idx + 1,
          p.nama,
          `${p.berat_kg} kg`,
          `${p.karbon} kg CO₂e`,
        ])

      autoTable(doc, {
        startY: 55,
        head: [["No", "Produk", "Berat", "Emisi"]],
        body: tableBody,
        theme: "grid",
        styles: { fontSize: 9 },
        headStyles: {
          fillColor: [0, 102, 51],
          halign: "center",
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 15 },
          2: { halign: "center" },
          3: { halign: "right" },
        },
      })

      // Total
      const finalY = (doc as any).lastAutoTable.finalY + 10

      doc.setFillColor(0, 102, 51)
      doc.rect(14, finalY, 182, 15, "F")
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.text(
        `TOTAL: ${data.total_emisi} kg CO₂e`,
        105,
        finalY + 10,
        { align: "center" }
      )

      doc.save(`laporan-${strukId}.pdf`)
    } catch (err) {
      console.error(err)
      alert("Gagal membuat PDF")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* TopBar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Riwayat</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-5 w-5" />
            <span className="font-medium">{userName}</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Filter Tanggal */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-green-700" />
            <h2 className="font-semibold">Filter Tanggal</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Dari
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Sampai
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate("")
                setEndDate("")
              }}
              className="text-sm text-green-700 mt-2 hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* List Riwayat */}
        <div className="space-y-3">
          {filteredHistories.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Tidak ada riwayat
            </div>
          ) : (
            filteredHistories.map((h) => (
              <div
                key={h.struk_id}
                className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    Struk #{h.struk_id}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(h.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-green-700 font-medium mt-1">
                    {h.total_emisi} kg CO₂e
                  </p>
                </div>

                <button
                  onClick={() => downloadPDF(h.struk_id)}
                  disabled={isDownloading}
                  className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:bg-gray-400 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  PDF
                </button>
              </div>
            ))
          )}
        </div>
        
        </div>
      </main>
    </div>
  )
}