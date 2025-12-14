"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Cloud } from "lucide-react"
import TopBar from "@/components/top-bar"
import BottomNav from "@/components/bottom-nav"
import Card from "@/components/card"
import { Button } from "@/components/ui/button"

export default function UploadPage() {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    // Handle file drop
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <TopBar />

      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-2">Upload Data Produksi & Pembelian</h2>
          <p className="text-muted-foreground mb-6">
            Unggah file CSV atau Excel untuk menambahkan data emisi baru Anda
          </p>

          {/* Upload Card */}
          <Card className="bg-card rounded-3xl shadow-md p-8 border-2 border-dashed border-border mb-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`text-center py-12 cursor-pointer transition-all ${
                isDragOver ? "bg-secondary" : "hover:bg-secondary/50"
              } rounded-2xl`}
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Cloud className="w-8 h-8 text-primary" />
                </div>
              </div>
              <p className="text-lg font-semibold text-foreground mb-2">Klik atau seret file ke sini</p>
              <p className="text-sm text-muted-foreground mb-4">Format: CSV, Excel (.xlsx, .xls)</p>
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Upload className="w-4 h-4 mr-2" />
                Pilih File
              </Button>
            </div>
          </Card>

          {/* Info */}
          <Card className="bg-secondary/50 rounded-3xl shadow-md p-6 border border-border/50">
            <h3 className="font-semibold text-foreground mb-3">Format File yang Diterima:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>CSV dengan kolom: Tanggal, Kategori, Jumlah, Satuan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Excel dengan sheet bernama "Data Emisi"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Ukuran maksimal file: 10MB</span>
              </li>
            </ul>
          </Card>
        </div>
      </main>

      <BottomNav active="upload" />
    </div>
  )
}
