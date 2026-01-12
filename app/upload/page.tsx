"use client"

import { useRef, useState, useMemo } from "react"
import { Upload, Cloud, FileCheck, X } from "lucide-react"

// Import komponen yang sudah ada
import TopBar from "@/components/top-bar"
import Card from "@/components/card"

// Komponen Card fallback jika import gagal
function CardFallback({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {children}
    </div>
  )
}

// Button Component
type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  variant?: ButtonVariant;
  className?: string;
}

function Button({ children, onClick, disabled, variant = "primary", className = "" }: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-[#254B37] text-white hover:bg-[#1d3a2a] disabled:hover:bg-[#254B37]",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:hover:bg-gray-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 disabled:hover:bg-red-50"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// Input Component
function Input({ type = "text", placeholder, value, onChange, className = "" }: any) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254B37] focus:border-transparent ${className}`}
    />
  )
}

// Select Component
function Select({ value, onValueChange, children }: any) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254B37] focus:border-transparent bg-white"
    >
      {children}
    </select>
  )
}

function SelectItem({ value, children }: any) {
  return <option value={value}>{children}</option>
}

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

      await fetch("https://carbonscan-api.vercel.app/api/emission", {
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* UPLOAD SECTION */}
          <Card className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Struk Belanja</h2>
              <p className="text-sm text-gray-600">Unggah foto struk belanja bahan makanan Anda untuk analisis emisi karbon</p>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              hidden
              onChange={(e) => pickFile(e.target.files?.[0])}
            />

            {!file ? (
              <div 
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-[#254B37] hover:bg-gray-50 transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Cloud className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Klik untuk memilih file
                    </p>
                    <p className="text-xs text-gray-500">
                      Format: JPG, JPEG, PNG (Max 10MB)
                    </p>
                  </div>
                  <Button variant="primary">
                    <Upload className="w-4 h-4" />
                    Pilih File
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={processReceipt} disabled={loading} variant="primary">
                      {loading ? "Memproses..." : "Proses Struk"}
                    </Button>
                    <Button onClick={() => setFile(null)} variant="danger">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* PRODUCT LIST */}
          {products.length > 0 && (
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Daftar Produk Terdeteksi</h3>
                <p className="text-sm text-gray-600">Masukkan jumlah dan satuan untuk setiap produk</p>
              </div>

              <div className="space-y-3 mb-6">
                {products.map((p, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-5">
                        <p className="text-sm font-medium text-gray-900">{p.produk}</p>
                      </div>
                      <div className="col-span-4">
                        <Input
                          type="number"
                          placeholder="Jumlah"
                          value={p.value}
                          onChange={(e: any) => {
                            const v = e.target.value
                            setProducts((prev) => {
                              const c = [...prev]
                              c[i].value = v
                              return c
                            })
                          }}
                          className="w-full"
                        />
                      </div>
                      <div className="col-span-3">
                        <Select
                          value={p.unit}
                          onValueChange={(u: string) => {
                            setProducts((prev) => {
                              const c = [...prev]
                              c[i].unit = u
                              return c
                            })
                          }}
                        >
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="gram">gram</SelectItem>
                          <SelectItem value="pcs">pcs</SelectItem>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={calculateAndSave} disabled={loading} variant="primary" className="w-full">
                {loading ? "Menghitung..." : "Hitung & Simpan Emisi"}
              </Button>
            </Card>
          )}

          {/* RESULTS */}
          {result && (
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Hasil Analisis Emisi</h3>
                
                <div className="bg-[#254B37] text-white rounded-xl p-6 mb-6">
                  <p className="text-sm opacity-90 mb-1">Total Emisi Karbon</p>
                  <p className="text-4xl font-bold">{result.total_karbon.toFixed(2)}</p>
                  <p className="text-sm opacity-90">kg CO₂e</p>
                </div>
              </div>

              {/* Detail Table */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Detail Per Bahan</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-4 text-sm font-semibold text-gray-900">Bahan</th>
                        <th className="text-right p-4 text-sm font-semibold text-gray-900">Emisi (kg CO₂e)</th>
                        <th className="text-right p-4 text-sm font-semibold text-gray-900">Kategori</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.detail.map((d, i) => (
                        <tr key={i} className="border-t border-gray-200">
                          <td className="p-4 text-sm text-gray-900">{d.produk}</td>
                          <td className="p-4 text-sm text-gray-900 text-right font-medium">
                            {d.emisi.toFixed(2)}
                          </td>
                          <td className="p-4 text-sm text-gray-600 text-right">{d.kategori}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Distribusi Per Kategori</h4>
                <div className="space-y-3">
                  {Object.entries(categorySummary).map(([k, v]) => (
                    <div key={k}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-900">{k}</span>
                        <span className="text-gray-600">{v}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#254B37] transition-all"
                          style={{ width: `${v}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emission Level */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🌱</span>
                  </div>
                  <div>
                    <p className="text-sm text-green-700 mb-1">Kategori Emisi</p>
                    <p className="text-lg font-bold text-green-900">{emissionLevel}</p>
                  </div>
                </div>
              </div>

              {/* Carbon Offset */}
              <div className="border border-gray-200 rounded-xl p-5">
                <h4 className="font-bold text-gray-900 mb-3">Estimasi Biaya Carbon Offset</h4>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-gray-900">
                    Rp {(result.total_karbon * OFFSET_PRICE).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>🌳</span>
                  <span>Platform: <strong>Lindungi Hutan</strong></span>
                </div>
              </div>

            </Card>
          )}

        </div>
      </main>
    </div>
  )
}