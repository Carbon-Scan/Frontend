"use client"

import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  return (
    <main className="bg-white overflow-x-hidden">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <Image src="/logo bg.png" alt="CarbonScan" width={36} height={36} />
            <span className="font-semibold text-[#254B37] text-base sm:text-lg">
              CarbonScan
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <a href="#footprint" className="text-sm text-gray-600 hover:text-gray-900">
              Carbon Footprint
            </a>
            <a href="#asal" className="text-sm text-gray-600 hover:text-gray-900">
              Asal Emisi
            </a>
            <a href="#cara-kerja" className="text-sm text-gray-600 hover:text-gray-900">
              Cara Kerja
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-semibold text-[#254B37] hover:text-[#1d3a2a] transition"
            >
              Masuk
            </Link>

            <Link
              href="/register"
              className="px-5 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="pt-28 pb-28 px-6 bg-[#254B37] text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">

          <div className="pl-4 md:pl-8">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Analisis Carbon Footprint <br />
              Bahan Pangan <br />
              <span className="text-green-200">Berbasis Struk Belanja</span>
            </h1>

            <p className="text-green-100 mb-8 max-w-md text-sm leading-relaxed">
              CarbonScan merupakan aplikasi berbasis web yang menyajikan analisis estimasi
              carbon footprint dari konsumsi bahan pangan berdasarkan data struk belanja.
              Aplikasi ini bertujuan sebagai media edukasi untuk meningkatkan kesadaran
              terhadap dampak lingkungan dari aktivitas konsumsi sehari-hari.
            </p>

            <Link
              href="/register"
              className="inline-block px-7 py-3 rounded-full bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition shadow-md"
            >
              Mulai Analisis
            </Link>
          </div>

          <div className="relative w-full h-96 mx-auto">
            <div className="absolute left-[-24px] top-1/2 -translate-y-1/2 translate-x-8 w-[280px] h-[280px] rounded-full overflow-hidden">
              <Image src="/sayur.jpeg" alt="Sayur" fill className="object-cover" />
            </div>

            <div className="absolute right-0 top-2 -translate-x-6 w-[200px] h-[200px] rounded-full overflow-hidden">
              <Image src="/daging.jpeg" alt="Daging" fill className="object-cover" />
            </div>

            <div className="absolute right-12 bottom-0 -translate-x-6 -translate-y-4 w-[135px] h-[135px] rounded-full overflow-hidden">
              <Image src="/sembako.jpeg" alt="Sembako" fill className="object-cover" />
            </div>
          </div>

        </div>
      </section>

      {/* ================= FOOTPRINT ================= */}
      <section id="footprint" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Memahami Carbon Footprint dan Carbon Offset
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed">
            Carbon footprint adalah estimasi jumlah emisi karbon yang dihasilkan dari
            konsumsi bahan pangan dalam aktivitas sehari-hari, mulai dari proses produksi
            hingga distribusi ke konsumen. Sementara itu, carbon offset merupakan upaya
            untuk mengimbangi emisi karbon yang dihasilkan dengan tindakan ramah
            lingkungan, seperti penanaman pohon atau dukungan terhadap program
            pengurangan emisi.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed mt-6">
            Melalui CarbonScan, data pada struk belanja dianalisis untuk menampilkan
            ringkasan dan visualisasi jejak karbon, serta estimasi carbon offset sebagai
            informasi pendukung dalam meningkatkan kesadaran lingkungan.
          </p>
          
        </div>
      </section>

      {/* ================= ASAL EMISI ================= */}
      <section id="asal" className="py-24 px-6 bg-[#D8F3DC]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Emisi Karbon Bahan Pangan Berasal dari Mana?
          </h2>

          <p className="text-center text-gray-700 max-w-3xl mx-auto mb-16">
            Emisi karbon pada bahan pangan dihasilkan dari berbagai proses yang terjadi
            sebelum bahan tersebut digunakan dalam aktivitas memasak. Proses ini
            mencakup tahapan sejak produksi hingga distribusi kepada konsumen.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            <Card
              title="Produksi Bahan Pangan"
              desc="Emisi yang dihasilkan dari proses produksi bahan pangan, termasuk penggunaan sumber daya alam, energi, dan aktivitas produksi pada tahap awal."
            />
            <Card
              title="Pengolahan dan Penyimpanan"
              desc="Emisi yang berasal dari proses pengolahan, pendinginan, serta penyimpanan bahan pangan sebelum digunakan."
            />
            <Card
              title="Distribusi dan Transportasi"
              desc="Emisi yang dihasilkan selama proses pengiriman bahan pangan dari produsen ke distributor maupun konsumen."
            />
          </div>
        </div>
      </section>

      {/* ================= CARA KERJA ================= */}
      <section id="cara-kerja" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Cara Kerja CarbonScan
          </h2>

          <div className="grid md:grid-cols-4 gap-8 mt-16">
            <Step number="1" title="Unggah Struk Belanja" desc="Pengguna mengunggah foto atau dokumen struk belanja bahan pangan." />
            <Step number="2" title="Analisis Data" desc="Sistem mengekstraksi informasi bahan pangan dari struk belanja." />
            <Step number="3" title="Perhitungan Carbon Footprint" desc="Sistem menghitung estimasi carbon footprint berdasarkan data yang tersedia." />
            <Step number="4" title="Hasil dan Estimasi Carbon Offset" desc="Hasil analisis disajikan dalam bentuk ringkasan, visualisasi, dan estimasi carbon offset." />
          </div>
        </div>
      </section>

      {/* ================= CTA DOWNLOAD ANDROID ================= */}
      <section className="bg-[#254B37] px-6 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-16">

          <div className="pl-6 md:pl-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
              Pantau Dampak Lingkungan <br />
              dari Konsumsi Bahan Pangan
            </h2>

            <p className="text-green-100 text-lg mb-8 max-w-lg">
              Unduh aplikasi CarbonScan versi Android untuk memantau dan memahami
              dampak lingkungan dari konsumsi bahan pangan secara praktis.
            </p>

            <a
              href="#"
              className="inline-block px-7 py-3 rounded-full
                         bg-emerald-500 text-white
                         font-semibold text-sm
                         hover:bg-emerald-400 transition shadow-md"
            >
              Download Android
            </a>
          </div>

          <div className="flex justify-center md:justify-end">
            {/* ⬇️ FOTO DIPERBESAR LAGI */}
            <div className="relative w-[500px] h-[720px]">
              <Image
                src="/mockup.png"
                alt="CarbonScan Mobile App"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#D8F3DC] px-6 py-14">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Image src="/logo bg.png" alt="CarbonScan Logo" width={28} height={28} />
            <span className="font-semibold text-lg text-[#254B37]">CarbonScan</span>
          </div>

          <p className="text-sm text-[#3A5A40] mb-6">
            Aplikasi analisis carbon footprint bahan pangan berbasis struk belanja
          </p>

          <p className="text-xs text-[#52796F]">© 2026 CarbonScan</p>
        </div>
      </footer>
    </main>
  )
}

/* ================= COMPONENTS ================= */

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  )
}

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="p-6">
      <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
        {number}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  )
}
