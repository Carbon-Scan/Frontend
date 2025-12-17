"use client"

import { useRef, useState } from "react"
import {
  Upload,
  Cloud,
  FileText,
  Image as ImageIcon,
  Calculator,
} from "lucide-react"

import TopBar from "@/components/top-bar"
import Card from "@/components/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
]

type DetectedProduct = {
  produk: string
  karbon_kg_per_kg: number
  kategori: string
  confidence: number
  berat_kg?: number
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const [result, setResult] = useState<{
    raw_text: string
    detected_products: DetectedProduct[]
  } | null>(null)

  const [calculationResult, setCalculationResult] = useState<{
    detail: {
      produk: string
      berat_kg: number
      karbon: number
    }[]
    total_karbon: number
  } | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)


  const validateAndSetFile = (selectedFile?: File) => {
    if (!selectedFile) return

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      alert("Format file tidak didukung")
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB")
      return
    }

    setFile(selectedFile)
    setResult(null)
    setCalculationResult(null)
  }

  const uploadToBackend = async () => {
    if (!file) return

    setLoading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("http://127.0.0.1:8000/predict-carbon", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      setResult(data)
    } catch {
      alert("Backend AI tidak bisa diakses")
    } finally {
      setLoading(false)
    }
  }

  const handleCalculateCarbon = async () => {
    if (!result) return

    const items = result.detected_products
      .filter((p) => p.berat_kg && p.berat_kg > 0)
      .map((p) => ({
        produk: p.produk,
        berat_kg: p.berat_kg!,
      }))

    if (items.length === 0) {
      alert("Masukkan berat produk terlebih dahulu")
      return
    }

    const res = await fetch("http://127.0.0.1:8000/calculate-carbon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })

    const data = await res.json()
    setCalculationResult(data)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />

      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-6">

          <Card className="p-6 border-dashed border-2 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => validateAndSetFile(e.target.files?.[0])}
            />

            <Cloud className="mx-auto mb-3 text-primary" size={32} />

            <p className="font-semibold mb-1">Unggah Struk Belanja</p>
            <p className="text-sm text-muted-foreground mb-4">
              PDF atau gambar (maks. 10MB)
            </p>

            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Pilih File
            </Button>
          </Card>

          {file && (
            <Card className="p-4 flex items-center gap-3">
              {file.type === "application/pdf" ? (
                <FileText className="text-red-500" />
              ) : (
                <ImageIcon className="text-green-600" />
              )}

              <div className="flex-1">
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <Button onClick={uploadToBackend} disabled={loading}>
                {loading ? "Memproses..." : "Proses Struk"}
              </Button>
            </Card>
          )}

          {result && (
            <Card className="p-5 space-y-3">
              <h3 className="font-bold">Produk Terdeteksi</h3>

              {result.detected_products.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border-b py-2"
                >
                  <span className="flex-1 font-medium">{p.produk}</span>

                  <div className="w-28">
                    <label className="text-xs text-muted-foreground">
                      Berat (kg)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="0.0"
                      onChange={(e) => {
                        const updated = [...result.detected_products]
                        updated[i].berat_kg = Number(e.target.value)
                        setResult({
                          ...result,
                          detected_products: updated,
                        })
                      }}
                    />
                  </div>
                </div>
              ))}

              <Button className="w-full mt-3" onClick={handleCalculateCarbon}>
                <Calculator className="w-4 h-4 mr-2" />
                Hitung Emisi Karbon
              </Button>
            </Card>
          )}

          {calculationResult && (
            <Card className="p-5">
              <h3 className="font-bold mb-3">Hasil Emisi Karbon</h3>

              {calculationResult.detail.map((d, i) => (
                <div
                  key={i}
                  className="flex justify-between py-1 text-sm"
                >
                  <span>
                    {d.produk} ({d.berat_kg} kg)
                  </span>
                  <span>{d.karbon} CO₂e</span>  
                </div>
              ))}

              <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                <span>Total Emisi</span>
                <span>{calculationResult.total_karbon} CO₂e</span>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
