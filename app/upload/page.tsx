"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Upload, Cloud, FileText, Image as ImageIcon } from "lucide-react"

import TopBar from "@/components/top-bar"
import Card from "@/components/card"
import { Button } from "@/components/ui/button"

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
]

export default function UploadPage() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  /* ================= HANDLERS ================= */

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

    const droppedFile = e.dataTransfer.files[0]
    validateAndSetFile(droppedFile)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    validateAndSetFile(selectedFile)
  }

  const validateAndSetFile = (selectedFile?: File) => {
    if (!selectedFile) return

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      alert("Format file tidak didukung. Gunakan PDF, JPG, JPEG, atau PNG.")
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB.")
      return
    }

    setFile(selectedFile)
  }

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* TOP BAR */}
      <TopBar />

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto">
          {/* JUDUL */}
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Unggah Struk Belanja Bahan Makanan
          </h2>
          <p className="text-muted-foreground mb-6">
            Unggah foto atau PDF struk belanja untuk menghitung estimasi emisi karbon bahan makanan
          </p>

          {/* UPLOAD CARD */}
          <Card className="bg-card rounded-3xl shadow-md p-8 border-2 border-dashed border-border mb-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFilePicker}
              className={`text-center py-12 cursor-pointer transition-all rounded-2xl ${
                isDragOver ? "bg-secondary" : "hover:bg-secondary/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Cloud className="w-8 h-8 text-primary" />
                </div>
              </div>

              <p className="text-lg font-semibold text-foreground mb-2">
                Klik atau seret struk ke sini
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                PDF, JPG, JPEG, PNG (maks. 10MB)
              </p>

              <Button
                type="button"
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Upload className="w-4 h-4 mr-2" />
                Pilih File
              </Button>
            </div>
          </Card>

          {/* FILE PREVIEW */}
          {file && (
            <Card className="rounded-2xl p-4 border border-border/50">
              <div className="flex items-center gap-3">
                {file.type === "application/pdf" ? (
                  <FileText className="w-6 h-6 text-red-500" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-green-600" />
                )}

                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
