"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
    avgRating: 0
  })
  const [trendData, setTrendData] = useState<any[]>([])

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/review`,
        {
          credentials: "include",
        }
      )

      if (res.status === 401 || res.status === 403) {
        router.push("/admin/login")
        return
      }

      const data = await res.json()
      const reviewData = data.reviews || []
      setReviews(reviewData)
      
      // Calculate statistics
      const total = reviewData.length
      const positive = reviewData.filter((r: any) => r.sentiment?.toLowerCase() === "positive").length
      const neutral = reviewData.filter((r: any) => r.sentiment?.toLowerCase() === "neutral").length
      const negative = reviewData.filter((r: any) => r.sentiment?.toLowerCase() === "negative").length
      
      setStats({
        total,
        positive,
        neutral,
        negative,
        avgRating: total > 0 ? parseFloat(((positive * 5 + neutral * 3 + negative * 1) / total).toFixed(1)) : 0
      })
      
      // Generate trend data for chart (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return date.toISOString().split('T')[0]
      })
      
      const trendStats = last7Days.map(date => {
        const dayReviews = reviewData.filter((r: any) => {
          const reviewDate = new Date(r.created_at).toISOString().split('T')[0]
          return reviewDate === date
        })
        
        const dayPositive = dayReviews.filter((r: any) => r.sentiment?.toLowerCase() === "positive").length
        const dayNeutral = dayReviews.filter((r: any) => r.sentiment?.toLowerCase() === "neutral").length
        const dayNegative = dayReviews.filter((r: any) => r.sentiment?.toLowerCase() === "negative").length
        
        return {
          date,
          positive: dayPositive,
          neutral: dayNeutral,
          negative: dayNegative,
          total: dayReviews.length
        }
      })
      
      setTrendData(trendStats)
      
      setLoading(false)
    }

    fetchReviews()
  }, [router])

  const getSentimentColor = (sentiment: string) => {
    const lowerSentiment = sentiment?.toLowerCase()
    switch (lowerSentiment) {
      case "positive":
        return "bg-green-50 text-green-700 border-green-200"
      case "negative":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getRatingStars = (sentiment: string) => {
    const rating = sentiment === "positive" ? 5 : sentiment === "neutral" ? 3 : 1
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const positivePercent = stats.total > 0 ? (stats.positive / stats.total) * 100 : 0
  const neutralPercent = stats.total > 0 ? (stats.neutral / stats.total) * 100 : 0
  const negativePercent = stats.total > 0 ? (stats.negative / stats.total) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sentiment Analysis Dashboard</h1>
          <p className="text-gray-400">Monitor and analyze user feedback in real-time</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Feedback</h3>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Positive</h3>
            <p className="text-3xl font-bold text-green-500">{stats.positive}</p>
            <p className="text-sm text-gray-500 mt-1">{positivePercent.toFixed(1)}% of total</p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Neutral</h3>
            <p className="text-3xl font-bold text-gray-400">{stats.neutral}</p>
            <p className="text-sm text-gray-500 mt-1">{neutralPercent.toFixed(1)}% of total</p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Negative</h3>
            <p className="text-3xl font-bold text-red-500">{stats.negative}</p>
            <p className="text-sm text-gray-500 mt-1">{negativePercent.toFixed(1)}% of total</p>
          </div>
        </div>

        {/* Sentiment Trend Chart & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Trend Chart */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-6">Sentiment Trend (Last 7 Days)</h2>
            
            <div className="relative h-64">
              <svg viewBox="0 0 800 250" className="w-full h-full">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <line
                    key={i}
                    x1="60"
                    y1={40 + i * 40}
                    x2="780"
                    y2={40 + i * 40}
                    stroke="#374151"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Y-axis labels */}
                {[5, 4, 3, 2, 1, 0].map((value, i) => (
                  <text
                    key={i}
                    x="45"
                    y={45 + i * 40}
                    fontSize="12"
                    fill="#9ca3af"
                    textAnchor="end"
                  >
                    {value}
                  </text>
                ))}
                
                {/* X-axis labels */}
                {trendData.map((item, i) => (
                  <text
                    key={i}
                    x={80 + i * 100}
                    y="235"
                    fontSize="11"
                    fill="#9ca3af"
                    textAnchor="middle"
                  >
                    {new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                  </text>
                ))}
                
                {/* Volume bars */}
                {trendData.map((item, i) => {
                  const barHeight = (item.total / Math.max(...trendData.map(d => d.total), 1)) * 60
                  return (
                    <rect
                      key={`bar-${i}`}
                      x={65 + i * 100}
                      y={220 - barHeight}
                      width="30"
                      height={barHeight}
                      fill="#3b82f6"
                      opacity="0.2"
                      rx="2"
                    />
                  )
                })}
                
                {/* Positive line */}
                <polyline
                  points={trendData.map((item, i) => {
                    const y = 220 - (item.positive / Math.max(...trendData.map(d => d.positive || 1), 1)) * 180
                    return `${80 + i * 100},${y}`
                  }).join(' ')}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Neutral line */}
                <polyline
                  points={trendData.map((item, i) => {
                    const y = 220 - (item.neutral / Math.max(...trendData.map(d => d.neutral || 1), 1)) * 180
                    return `${80 + i * 100},${y}`
                  }).join(' ')}
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Negative line */}
                <polyline
                  points={trendData.map((item, i) => {
                    const y = 220 - (item.negative / Math.max(...trendData.map(d => d.negative || 1), 1)) * 180
                    return `${80 + i * 100},${y}`
                  }).join(' ')}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Data points */}
                {trendData.map((item, i) => {
                  const yPos = 220 - (item.positive / Math.max(...trendData.map(d => d.positive || 1), 1)) * 180
                  const yNeu = 220 - (item.neutral / Math.max(...trendData.map(d => d.neutral || 1), 1)) * 180
                  const yNeg = 220 - (item.negative / Math.max(...trendData.map(d => d.negative || 1), 1)) * 180
                  
                  return (
                    <g key={`points-${i}`}>
                      <circle cx={80 + i * 100} cy={yPos} r="4" fill="#22c55e" stroke="#1f2937" strokeWidth="2" />
                      <circle cx={80 + i * 100} cy={yNeu} r="4" fill="#6b7280" stroke="#1f2937" strokeWidth="2" />
                      <circle cx={80 + i * 100} cy={yNeg} r="4" fill="#ef4444" stroke="#1f2937" strokeWidth="2" />
                    </g>
                  )
                })}
              </svg>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-400">Positive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-sm text-gray-400">Neutral</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-400">Negative</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500 opacity-30"></div>
                <span className="text-sm text-gray-400">Volume</span>
              </div>
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-6">Distribution</h2>
            
            {/* Donut Chart */}
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 mb-6">
                <svg viewBox="0 0 200 200" className="transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="40"
                  />
                  {/* Positive segment */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="40"
                    strokeDasharray={`${positivePercent * 5.027} 502.7`}
                    strokeDashoffset="0"
                  />
                  {/* Neutral segment */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#6b7280"
                    strokeWidth="40"
                    strokeDasharray={`${neutralPercent * 5.027} 502.7`}
                    strokeDashoffset={`-${positivePercent * 5.027}`}
                  />
                  {/* Negative segment */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="40"
                    strokeDasharray={`${negativePercent * 5.027} 502.7`}
                    strokeDashoffset={`-${(positivePercent + neutralPercent) * 5.027}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                  <div className="text-xs text-gray-400">Total</div>
                </div>
              </div>

              {/* Legend */}
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-gray-300">Positive</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{stats.positive}</div>
                    <div className="text-xs text-gray-500">{positivePercent.toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-sm font-medium text-gray-300">Neutral</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{stats.neutral}</div>
                    <div className="text-xs text-gray-500">{neutralPercent.toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium text-gray-300">Negative</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{stats.negative}</div>
                    <div className="text-xs text-gray-500">{negativePercent.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Recent Reviews</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {reviews.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">No reviews yet</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="p-6 hover:bg-gray-700 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {review.userEmail ? review.userEmail[0].toUpperCase() : "U"}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-white">
                          {review.userEmail || "Anonymous"}
                        </span>
                        {getRatingStars(review.sentiment)}
                      </div>
                      
                      <p className="text-gray-300 mb-3 leading-relaxed">{review.text}</p>
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getSentimentColor(review.sentiment)}`}>
                          {review.sentiment}
                        </span>
                        
                        <span className="text-xs text-gray-500">
                          <span className="font-medium">Confidence:</span> {(review.confidence * 100).toFixed(1)}%
                        </span>
                        
                        <span className="text-xs text-gray-500">
                           {new Date(review.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}