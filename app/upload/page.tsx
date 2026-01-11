"use client"

import { useRef, useState, useMemo } from "react"
import { Upload, Cloud } from "lucide-react"

import TopBar from "@/components/top-bar"
import Card from "@/components/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const HF_API = "https://delia-ayu-nandhita-emisicarbonmodel.hf.space"

const UNIT_TO_KG: Record<string, number> = {
  kg: 1,
  gram: 0.001,
  liter: 1,
  ml: 0.001,
  pcs: 0.05,
}

type Product = {
  produk: string
  value: string
  unit: string
}

type EmissionDetail = {
  produk: string
  emisi: number
  kategori: string
}

/* ===============================
   PNG → JPEG (RGBA SAFE)
================================ */
async function convertToJpeg(file: File): Promise<File> {
  if (file.type === "image/jpeg") return file

  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement("canvas")
  canvas.width = bitmap.width
  canvas.height = bitmap.height

  const ctx = canvas.getContext("2d")!
  ctx.drawImage(bitmap, 0, 0)

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(new File([blob!], "converted.jpg", { type: "image/jpeg" }))
      },
      "image/jpeg",
      0.95
    )
  })
}

export default function UploadPage() {
  const fileRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [result, setResult] = useState<{
    total_karbon: number
    detail: EmissionDetail[]
  } | null>(null)

  const pickFile = (f?: File) => {
    if (!f) return
    setFile(f)
    setProducts([])
    setResult(null)
  }

  /* ===============================
     OCR + DETEKSI PRODUK (HF)
  ================================ */
  const processReceipt = async () => {
    if (!file) return alert("Pilih file dulu")
    setLoading(true)

    try {
      const safeFile = await convertToJpeg(file)
      const formData = new FormData()
      formData.append("file", safeFile)

      const res = await fetch(`${HF_API}/predict-carbon`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error(await res.text())

      const data = await res.json()

      setProducts(
        (data.detected_products || []).map((p: any) => ({
          produk: String(p.produk ?? p).trim(),
          value: "",
          unit: "kg",
        }))
      )
    } catch {
      alert("Gagal proses struk")
    } finally {
      setLoading(false)
    }
  }

  /* ===============================
     HITUNG & SIMPAN
  ================================ */
  const calculateAndSave = async () => {
    const token = localStorage.getItem("access_token")
    if (!token) return alert("Silakan login dulu")

    if (products.some((p) => !p.value))
      return alert("Isi semua jumlah")

    setLoading(true)

    try {
      const itemsKg = products.map((p) => ({
        produk: p.produk,
        berat_kg: Number(p.value) * (UNIT_TO_KG[p.unit] ?? 1),
      }))

      const calcRes = await fetch(
        `${HF_API}/calculate-carbon`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: itemsKg }),
        }
      )

      const calcData = await calcRes.json()

      const safeResult = {
        total_karbon: Number(calcData.total_karbon) || 0,
        detail: Array.isArray(calcData.detail)
          ? calcData.detail.map((d: any) => ({
              produk: String(d.produk),
              emisi: Number(d.emisi),
              kategori: String(d.kategori),
            }))
          : [],
      }

      setResult(safeResult)

      await fetch("http://localhost:4000/api/emission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(safeResult),
      })
    } catch {
      alert("Gagal menghitung atau menyimpan emisi")
    } finally {
      setLoading(false)
    }
  }

  /* ===============================
     SUMMARY & LEVEL
  ================================ */
  const categorySummary = useMemo<Record<string, number>>(() => {
    if (!result) return {}

    const total = result.total_karbon || 1
    const map: Record<string, number> = {}

    result.detail.forEach((d) => {
      map[d.kategori] = (map[d.kategori] || 0) + d.emisi
    })

    Object.keys(map).forEach((k) => {
      map[k] = Math.round((map[k] / total) * 100)
    })

    return map
  }, [result])

  const emissionLevel = useMemo(() => {
    if (!result) return "Rendah"
    if (result.total_karbon > 70) return "Tinggi"
    if (result.total_karbon > 40) return "Sedang"
    return "Rendah"
  }, [result])

  const OFFSET_PRICE = 1200

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />

      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* UPLOAD */}
          <Card className="p-8 border-dashed border-2 text-center space-y-4">
            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              hidden
              onChange={(e) => pickFile(e.target.files?.[0])}
            />

            <div className="flex flex-col items-center gap-3">
              <Cloud className="w-10 h-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Unggah foto struk belanja bahan makanan Anda
              </p>

              <Button onClick={() => fileRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Pilih File
              </Button>
            </div>
          </Card>

          {file && (
            <Card className="px-5 py-4 flex justify-between">
              <span className="text-sm">{file.name}</span>
              <Button onClick={processReceipt} disabled={loading}>
                Proses Struk
              </Button>
            </Card>
          )}

          {products.length > 0 && (
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-lg">Daftar Produk</h3>

              {products.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <span className="flex-1">{p.produk}</span>
                  <Input
                    type="number"
                    placeholder="Jumlah"
                    value={p.value}
                    onChange={(e) => {
                      const v = e.target.value
                      setProducts((prev) => {
                        const c = [...prev]
                        c[i].value = v
                        return c
                      })
                    }}
                  />
                  <Select
                    value={p.unit}
                    onValueChange={(u) => {
                      setProducts((prev) => {
                        const c = [...prev]
                        c[i].unit = u
                        return c
                      })
                    }}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="gram">gram</SelectItem>
                      <SelectItem value="pcs">pcs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}

              <Button onClick={calculateAndSave} disabled={loading}>
                {loading ? "Memproses..." : "Hitung & Simpan"}
              </Button>
            </Card>
          )}

          {result && (
            <Card className="p-6 space-y-6">

              <h3 className="font-bold text-lg">
                Total Emisi: {result.total_karbon.toFixed(2)} kg CO₂e
              </h3>

              <table className="w-full text-sm border">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2">Bahan</th>
                    <th className="text-right p-2">Emisi</th>
                  </tr>
                </thead>
                <tbody>
                  {result.detail.map((d, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{d.produk}</td>
                      <td className="p-2 text-right">
                        {d.emisi.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div>
                {Object.entries(categorySummary).map(([k, v]) => (
                  <div key={k} className="mb-2">
                    <div className="flex justify-between text-sm">
                      <span>{k}</span>
                      <span>{v}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full">
                      <div
                        className="h-3 rounded-full bg-green-500"
                        style={{ width: `${v}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 p-4 rounded-xl text-sm">
                <strong>Kategori Emisi: {emissionLevel}</strong>
              </div>

              <div>
                <h3 className="font-bold">Estimasi Biaya Carbon Offset</h3>
                <p className="text-sm">
                  Total Biaya:{" "}
                  <b>
                    Rp{" "}
                    {(result.total_karbon * OFFSET_PRICE).toLocaleString(
                      "id-ID"
                    )}
                  </b>
                </p>
              </div>

              <div className="text-sm">
                🌳 Platform Carbon Offset: <b>Lindungi Hutan</b>
              </div>

            </Card>
          )}

        </div>
      </main>
    </div>
  )
}
