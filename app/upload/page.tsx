"use client"

import { useRef, useState } from "react"
import { Upload, Cloud, FileText, Image as ImageIcon, Calculator } from "lucide-react"

import TopBar from "@/components/top-bar"
import Card from "@/components/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]

type DetectedProduct = {
  produk: string
  karbon_kg_per_kg: number
  kategori: string
  confidence: number
  berat_kg?: number
}

type PredictResult = {
  struk_id: number
  raw_text: string
  detected_products: DetectedProduct[]
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictResult | null>(null)
  const [calculationResult, setCalculationResult] = useState<{
    detail: { produk: string; berat_kg: number; karbon: number }[]
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

  // ================= UPLOAD STRUK =================
const uploadToBackend = async () => {
  if (!file) {
    alert("Silakan pilih file terlebih dahulu")
    return
  }

  setLoading(true)
  setResult(null)
  setCalculationResult(null)

  const formData = new FormData()
  formData.append("file", file)

  try {
    const res = await fetch("http://127.0.0.1:8000/predict-carbon/1", {
      method: "POST",
      body: formData,
    })

    // ❗ HANDLE ERROR RESPONSE
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || "Gagal memproses struk")
    }

    const data = await res.json()

    // ✅ NORMALISASI DATA DARI BACKEND
    const detectedProducts = (data.detected_products || []).map((p: any) => ({
      produk: p.produk,
      kategori: p.kategori ?? "unknown",
      karbon_kg_per_kg: Number(p.karbon_kg_per_kg ?? 0),
      confidence: Number(p.confidence ?? 0),
      berat_kg: 0, // default input user
    }))

    setResult({
      struk_id: data.struk_id,
      raw_text: data.raw_text ?? "",
      detected_products: detectedProducts,
    })
  } catch (error: any) {
    console.error("UPLOAD ERROR:", error)
    alert(error.message || "Backend AI tidak bisa diakses")
  } finally {
    setLoading(false)
  }
}


  // ================= HITUNG KARBON =================
  const handleCalculateCarbon = async () => {
    if (!result) return

    const invalid = result.detected_products.some(
      (p) => !p.berat_kg || p.berat_kg <= 0
    )

    if (invalid) {
      alert("Semua berat produk harus diisi")
      return
    }

    const items = result.detected_products.map((p) => ({
      produk: p.produk,
      berat_kg: p.berat_kg!,
      karbon_kg_per_kg: p.karbon_kg_per_kg, // 🔥 FIX PENTING
    }))

    const res = await fetch(
      `http://127.0.0.1:8000/calculate-carbon/${result.struk_id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      }
    )

    const data = await res.json()
    setCalculationResult(data)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />

      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* UPLOAD */}
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
              <Upload className="w-4 h-4 mr-2" /> Pilih File
            </Button>
          </Card>

          {/* FILE INFO */}
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
              <Button onClick={uploadToBackend} disabled={loading || !file}>
                {loading ? "Memproses..." : "Proses Struk"}
              </Button>

            </Card>
          )}

          {/* PRODUK */}
          {result && (
            <Card className="p-5 space-y-3">
              <h3 className="font-bold">Produk Terdeteksi</h3>

              {result.detected_products.map((p, i) => (
                <div key={i} className="flex items-center gap-3 border-b py-2">
                  <span className="flex-1 font-medium">{p.produk}</span>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="kg"
                    value={p.berat_kg ?? ""}
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      setResult((prev) => {
                        if (!prev) return prev
                        const updated = [...prev.detected_products]
                        updated[i] = { ...updated[i], berat_kg: value }
                        return { ...prev, detected_products: updated }
                      })
                    }}
                  />
                </div>
              ))}

              <Button className="w-full" onClick={handleCalculateCarbon}>
                <Calculator className="w-4 h-4 mr-2" />
                Hitung Emisi Karbon
              </Button>
            </Card>
          )}

          {/* HASIL */}
          {Array.isArray(calculationResult?.detail) && (
            <Card className="p-5">
              <h3 className="font-bold mb-3">Hasil Emisi Karbon</h3>

              {calculationResult.detail.map((d, i) => (
                <div key={i} className="flex justify-between py-1 text-sm">
                  <span>{d.produk} ({d.berat_kg} kg)</span>
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
