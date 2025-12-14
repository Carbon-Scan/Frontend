import ArticleContent from "./components/ArticleContent"
import LoginPreview from "./components/LoginPreview"

export default function Home() {
  return (
    <main className="bg-white text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

        <div className="lg:col-span-2">
          <ArticleContent />
        </div>

        <div>
          <LoginPreview />
        </div>

      </div>
    </main>
  )
}
