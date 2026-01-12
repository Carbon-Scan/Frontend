"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Landing Page + Google OAuth Handler
 * Token dari Supabase OAuth muncul di: /#access_token=...
 */
export default function LandingPage() {
  const router = useRouter()

  // =============================
  // HANDLE GOOGLE OAUTH TOKEN
  // =============================
  useEffect(() => {
    const hash = window.location.hash

    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.replace("#", ""))
      const token = params.get("access_token")

      if (token) {
        localStorage.setItem("access_token", token)

        // Bersihkan URL agar tidak kelihatan token
        window.history.replaceState(null, "", "/")

        router.replace("/dashboard")
      }
    }
  }, [router])

  return (
    <main className="bg-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo bg.png" alt="CarbonScan" className="w-8 h-8 sm:w-9 sm:h-9" />
            <span className="font-semibold text-gray-900 text-base sm:text-lg">CarbonScan</span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <a href="#footprint" className="text-sm text-gray-600 hover:text-gray-900">
              Footprint
            </a>
            <a href="#asal" className="text-sm text-gray-600 hover:text-gray-900">
              Asal Emisi
            </a>
            <a href="#cara-kerja" className="text-sm text-gray-600 hover:text-gray-900">
              Cara Kerja
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/login"
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Masuk
            </a>
            <a
              href="/register"
              className="px-4 sm:px-5 py-2 bg-[#254B37] text-white text-xs sm:text-sm font-medium hover:bg-[#1d3a2a]"
            >
              Daftar Gratis
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-20 sm:pt-24 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-[#254B37]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100/10 border border-emerald-200/20 mb-4 sm:mb-6">
                <span className="w-2 h-2 bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-100">Berbasis AI & OCR</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4 sm:mb-6">
                Ukur Jejak Karbon dari{" "}
                <span className="text-[#95D5B2]">Struk Belanja</span> Anda
              </h1>

              <p className="text-sm sm:text-base text-emerald-100 leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
                Analisis otomatis carbon footprint dari konsumsi bahan pangan. 
                Cocok untuk individu, UMKM, dan bisnis F&B yang peduli lingkungan.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-8 sm:mb-12">
                <a
                  href="/register"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#52B788] text-white text-sm font-semibold hover:bg-[#40916C] text-center"
                >
                  Mulai Analisis Gratis
                </a>
                <a
                  href="#cara-kerja"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-emerald-200/30 text-white text-sm font-semibold hover:border-emerald-200/50 hover:bg-white/5 text-center"
                >
                  Lihat Demo
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-emerald-200/20">
                <div>
                  <div className="text-lg sm:text-xl font-bold text-white mb-1">99%</div>
                  <div className="text-xs text-emerald-200">Akurasi OCR</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-white mb-1">&lt;3s</div>
                  <div className="text-xs text-emerald-200">Waktu Analisis</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-white mb-1">500+</div>
                  <div className="text-xs text-emerald-200">Bahan Pangan</div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative h-64 sm:h-96 lg:h-125 flex items-center justify-center mt-8 lg:mt-0">
              <div className="relative w-full h-full max-w-md mx-auto">
                {/* Background Images */}
                <img 
                  src="/sayur.jpeg" 
                  alt="Sayur" 
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-32 sm:w-48 h-32 sm:h-48 rounded-full object-cover shadow-2xl z-10"
                />
                <img 
                  src="/daging.jpeg" 
                  alt="Daging" 
                  className="absolute right-8 top-8 w-24 sm:w-36 h-24 sm:h-36 rounded-full object-cover shadow-2xl z-10"
                />
                <img 
                  src="/sembako.jpeg" 
                  alt="Sembako" 
                  className="absolute right-16 bottom-8 w-20 sm:w-28 h-20 sm:h-28 rounded-full object-cover shadow-2xl z-10"
                />

                {/* Main Card - Behind images */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 sm:w-50 bg-white p-5 sm:p-6 border border-gray-100 shadow-2xl z-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div/>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">Total Emisi</div>
                      <div className="text-xs text-gray-500">Hari ini</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-[#254B37] mb-6">
                    12.5 kg CO₂
                  </div>
                  <div className="space-y-3">
                    <ProgressBar label="Daging" value={45} color="bg-red-500" />
                    <ProgressBar label="Sayuran" value={20} color="bg-[#52B788]" />
                    <ProgressBar label="Sembako" value={35} color="bg-yellow-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTPRINT SECTION */}
      <section id="footprint" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Memahami Carbon Footprint
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Carbon footprint adalah total emisi gas rumah kaca yang dihasilkan dari aktivitas kita, 
              termasuk konsumsi makanan sehari-hari.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            <FeatureCard
              title="Apa itu Carbon Footprint?"
              description="Total estimasi emisi karbon dari konsumsi bahan pangan berdasarkan data struk belanja Anda. Setiap produk makanan memiliki jejak karbon yang berbeda-beda."
              bgColor="bg-[#D8F3DC]"
            />
            <FeatureCard
              title="Carbon Offset"
              description="Informasi tentang cara mengimbangi emisi karbon Anda melalui berbagai metode seperti menanam pohon atau mendukung energi terbarukan."
              bgColor="bg-[#D8F3DC]"
            />
          </div>
        </div>
      </section>

      {/* ASAL EMISI SECTION */}
      <section id="asal" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#D8F3DC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Dari Mana Emisi Karbon Berasal?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Emisi karbon bahan pangan dihasilkan sepanjang rantai pasokan, 
              dari produksi hingga sampai ke meja makan.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <ProcessCard
              number="01"
              title="Produksi"
              description="Emisi dari budidaya, peternakan, dan penggunaan pupuk/pestisida dalam proses produksi bahan pangan."
            />
            <ProcessCard
              number="02"
              title="Pengolahan"
              description="Emisi dari proses pengolahan, pengemasan, dan penyimpanan bahan pangan di fasilitas industri."
            />
            <ProcessCard
              number="03"
              title="Distribusi"
              description="Emisi dari transportasi dan distribusi bahan pangan dari produsen hingga ke tangan konsumen."
            />
          </div>
        </div>
      </section>

      {/* CARA KERJA SECTION */}
      <section id="cara-kerja" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Cara Kerja Sederhana
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Hanya 4 langkah mudah untuk menganalisis jejak karbon dari belanjaan Anda
            </p>
          </div>

          <div className="relative">
            {/* Connection Line - Desktop only */}
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-linear-to-r from-[#B7E4C7] via-[#95D5B2] to-[#B7E4C7]" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              <StepCard
                number="1"
                title="Upload Struk"
                description="Foto atau upload file struk belanja Anda"
              />
              <StepCard
                number="2"
                title="Ekstraksi Data"
                description="AI membaca dan mengekstrak item belanjaan"
              />
              <StepCard
                number="3"
                title="Analisis Emisi"
                description="Sistem menghitung carbon footprint"
              />
              <StepCard
                number="4"
                title="Lihat Hasil"
                description="Dashboard interaktif dengan visualisasi"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#254B37]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Mulai Kurangi Jejak Karbon Anda
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 mb-8 max-w-2xl mx-auto">
            Bergabung dengan ribuan pengguna yang sudah sadar akan dampak konsumsi mereka terhadap lingkungan
          </p>
          <a
            href="/register"
            className="inline-block px-6 sm:px-8 py-3 bg-[#52B788] text-white text-sm font-semibold hover:bg-[#40916C]"
          >
            Daftar Sekarang - Gratis
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#D8F3DC] text-gray-700 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo bg.png" alt="CarbonScan" className="w-8 h-8" />
                <span className="font-semibold text-[#254B37]">CarbonScan</span>
              </div>
              <p className="text-sm text-[#3A5A40]">
                Solusi analisis carbon footprint untuk gaya hidup berkelanjutan
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#254B37] mb-3 text-sm">Produk</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#254B37]">Fitur</a></li>
                <li><a href="#" className="hover:text-[#254B37]">Harga</a></li>
                <li><a href="#" className="hover:text-[#254B37]">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[#254B37] mb-3 text-sm">Perusahaan</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#254B37]">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-[#254B37]">Blog</a></li>
                <li><a href="#" className="hover:text-[#254B37]">Kontak</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[#254B37] mb-3 text-sm">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#254B37]">Privasi</a></li>
                <li><a href="#" className="hover:text-[#254B37]">Syarat & Ketentuan</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{value}%</span>
      </div>
      <div className="w-full bg-gray-100 h-2">
        <div className={`${color} h-2`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function FeatureCard({ title, description, bgColor }: { title: string; description: string; bgColor: string }) {
  return (
    <div className={`${bgColor} p-6 sm:p-8 hover:shadow-lg transition-shadow`}>
      <h3 className="text-base sm:text-lg font-bold text-[#254B37] mb-3">{title}</h3>
      <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
    </div>
  )
}

function ProcessCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative bg-white p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="absolute -top-3 -left-3 w-10 h-10 sm:w-12 sm:h-12 bg-[#254B37] flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
        {number}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 mt-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative text-center">
      <div className="relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#254B37] text-white font-bold text-lg sm:text-xl shadow-lg mb-4 z-10">
        {number}
      </div>
      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-600">{description}</p>
    </div>
  )
}