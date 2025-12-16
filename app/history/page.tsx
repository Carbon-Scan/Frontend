"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import jsPDF from "jspdf"

import TopBar from "@/components/top-bar"
import Card from "@/components/card"
import { Button } from "@/components/ui/button"

export default function HistoryPage() {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadPDF = () => {
    setIsDownloading(true)

    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.setTextColor(0, 102, 51)
    doc.text("LAPORAN EMISI", 105, 30, { align: "center" })

    doc.setLineWidth(0.5)
    doc.line(20, 35, 190, 35)

    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(
      "Tanggal: " + new Date().toLocaleDateString("id-ID"),
      20,
      50
    )
    doc.text(
      "Waktu: " + new Date().toLocaleTimeString("id-ID"),
      20,
      60
    )

    doc.setFontSize(14)
    doc.text("Data dari halaman Upload", 105, 80, {
      align: "center",
    })

    doc.save("riwayat-emisi.pdf")

    setTimeout(() => {
      setIsDownloading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* TOP BAR */}
      <TopBar />

      {/* CONTENT */}
      <main className="flex-1 p-4">
        <Card className="max-w-sm mx-auto mt-8">
          <div className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Download Riwayat
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              PDF berisi data emisi dari hasil upload
            </p>

            <Button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              {isDownloading
                ? "Membuat PDF..."
                : "Download PDF"}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
