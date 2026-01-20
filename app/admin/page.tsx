"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<any[]>([])
  const [filteredReviews, setFilteredReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adminData, setAdminData] = useState<any>(null)
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
    unknown: 0,
  })
  const [trendData, setTrendData] = useState<any[]>([])

  // Helper function to normalize sentiment
  const normalizeSentiment = (sentiment: string) => {
    const s = (sentiment || "").toLowerCase().trim()
    if (s.includes("positif") || s.includes("positive")) return "positive"
    if (s.includes("negatif") || s.includes("negative")) return "negative"
    if (s.includes("netral") || s.includes("neutral")) return "neutral"
    return "unknown"
  }

  const fetchAdminData = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/profile`,
        {
          credentials: "include",
        }
      )
      if (res.ok) {
        const data = await res.json()
        setAdminData(data.admin)
      }
    } catch (error) {
      console.error("Error fetching admin data:", error)
    }
  }

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      )
      if (res.ok) {
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const fetchReviews = async () => {
    try {
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
      setFilteredReviews(reviewData)
      
      // Calculate statistics
      const total = reviewData.length
      const positive = reviewData.filter((r: any) => normalizeSentiment(r.sentiment) === "positive").length
      const neutral = reviewData.filter((r: any) => normalizeSentiment(r.sentiment) === "neutral").length
      const negative = reviewData.filter((r: any) => normalizeSentiment(r.sentiment) === "negative").length
      const unknown = reviewData.filter((r: any) => normalizeSentiment(r.sentiment) === "unknown").length
      
      setStats({
        total,
        positive,
        neutral,
        negative,
        unknown,
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
        
        const dayPositive = dayReviews.filter((r: any) => normalizeSentiment(r.sentiment) === "positive").length
        const dayNeutral = dayReviews.filter((r: any) => normalizeSentiment(r.sentiment) === "neutral").length
        const dayNegative = dayReviews.filter((r: any) => normalizeSentiment(r.sentiment) === "negative").length
        
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
    } catch (error) {
      console.error("Error fetching reviews:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
    fetchReviews()
  }, [router])

  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredReviews(reviews)
    } else {
      const filtered = reviews.filter((r: any) => 
        normalizeSentiment(r.sentiment) === selectedFilter
      )
      setFilteredReviews(filtered)
    }
  }, [selectedFilter, reviews])

  const getSentimentColor = (sentiment: string) => {
    const s = (sentiment || "").toLowerCase().trim()
    
    if (s === "positive" || s === "positif") {
      return "bg-green-100 text-green-700 border-green-300"
    } else if (s === "negative" || s === "negatif") {
      return "bg-red-100 text-red-700 border-red-300"
    } else {
      return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const getRatingStars = (sentiment: string) => {
    const s = (sentiment || "").toLowerCase().trim()
    let rating = 3
    
    if (s === "positive" || s === "positif") {
      rating = 5
    } else if (s === "negative" || s === "negatif") {
      rating = 1
    } else {
      rating = 3
    }
    
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
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const positivePercent = stats.total > 0 ? (stats.positive / stats.total) * 100 : 0
  const neutralPercent = stats.total > 0 ? (stats.neutral / stats.total) * 100 : 0
  const negativePercent = stats.total > 0 ? (stats.negative / stats.total) * 100 : 0
  const unknownPercent = stats.total > 0 ? (stats.unknown / stats.total) * 100 : 0

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
 
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">Sentiment Analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {adminData && (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{adminData.name}</p>
                    <p className="text-xs text-gray-500">{adminData.email}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg border-2 border-white shadow-md">
                    {adminData.name ? adminData.name[0].toUpperCase() : "A"}
                  </div>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium text-sm border border-red-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Total Feedback</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Positive</h3>
            <p className="text-3xl font-bold text-green-600">{stats.positive}</p>
            <p className="text-sm text-gray-500 mt-1">{positivePercent.toFixed(1)}% of total</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Neutral</h3>
            <p className="text-3xl font-bold text-gray-600">{stats.neutral}</p>
            <p className="text-sm text-gray-500 mt-1">{neutralPercent.toFixed(1)}% of total</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Negative</h3>
            <p className="text-3xl font-bold text-red-600">{stats.negative}</p>
            <p className="text-sm text-gray-500 mt-1">{negativePercent.toFixed(1)}% of total</p>
          </div>
          
          {stats.unknown > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-yellow-200 hover:shadow-xl transition-shadow">
              <h3 className="text-sm font-medium text-yellow-600 mb-4">Unknown Sentiment</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.unknown}</p>
              <p className="text-sm text-gray-500 mt-1">{unknownPercent.toFixed(1)}% of total</p>
            </div>
          )}
        </div>

        {/* Sentiment Trend Chart & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Sentiment Trend (Last 7 Days)</h2>
            
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
                    stroke="#e5e7eb"
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
                    fill="#6b7280"
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
                    fill="#6b7280"
                    textAnchor="middle"
                  >
                    {new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                  </text>
                ))}
                
                {/* Volume bars */}
                {trendData.map((item, i) => {
                  const maxTotal = Math.max(...trendData.map(d => d.total), 1)
                  const barHeight = maxTotal > 0 ? (item.total / maxTotal) * 60 : 0
                  return (
                    <rect
                      key={`bar-${i}`}
                      x={65 + i * 100}
                      y={220 - barHeight}
                      width="30"
                      height={barHeight}
                      fill="#3b82f6"
                      opacity="0.15"
                      rx="2"
                    />
                  )
                })}
                
                {/* Positive line */}
                {stats.positive > 0 && (
                  <polyline
                    points={trendData.map((item, i) => {
                      const maxPositive = Math.max(...trendData.map(d => d.positive), 1)
                      const y = 220 - (item.positive / maxPositive) * 180
                      return `${80 + i * 100},${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                
                {/* Neutral line */}
                {stats.neutral > 0 && (
                  <polyline
                    points={trendData.map((item, i) => {
                      const maxNeutral = Math.max(...trendData.map(d => d.neutral), 1)
                      const y = 220 - (item.neutral / maxNeutral) * 180
                      return `${80 + i * 100},${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="#6b7280"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                
                {/* Negative line */}
                {stats.negative > 0 && (
                  <polyline
                    points={trendData.map((item, i) => {
                      const maxNegative = Math.max(...trendData.map(d => d.negative), 1)
                      const y = 220 - (item.negative / maxNegative) * 180
                      return `${80 + i * 100},${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                
                {/* Data points */}
                {trendData.map((item, i) => {
                  const maxPositive = Math.max(...trendData.map(d => d.positive), 1)
                  const maxNeutral = Math.max(...trendData.map(d => d.neutral), 1)
                  const maxNegative = Math.max(...trendData.map(d => d.negative), 1)
                  
                  const yPos = 220 - (item.positive / maxPositive) * 180
                  const yNeu = 220 - (item.neutral / maxNeutral) * 180
                  const yNeg = 220 - (item.negative / maxNegative) * 180
                  
                  return (
                    <g key={`points-${i}`}>
                      {stats.positive > 0 && <circle cx={80 + i * 100} cy={yPos} r="4" fill="#22c55e" stroke="white" strokeWidth="2" />}
                      {stats.neutral > 0 && <circle cx={80 + i * 100} cy={yNeu} r="4" fill="#6b7280" stroke="white" strokeWidth="2" />}
                      {stats.negative > 0 && <circle cx={80 + i * 100} cy={yNeg} r="4" fill="#ef4444" stroke="white" strokeWidth="2" />}
                    </g>
                  )
                })}
              </svg>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Positive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-sm text-gray-600">Neutral</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">Negative</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500 opacity-20"></div>
                <span className="text-sm text-gray-600">Volume</span>
              </div>
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Distribution</h2>
            
            {/* Donut Chart */}
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 mb-6">
                <svg viewBox="0 0 200 200" className="transform -rotate-90">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="40"
                  />
                  {positivePercent > 0 && (
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
                  )}
                  {neutralPercent > 0 && (
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
                  )}
                  {negativePercent > 0 && (
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
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
              </div>

              {/* Legend */}
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-gray-700">Positive</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{stats.positive}</div>
                    <div className="text-xs text-gray-500">{positivePercent.toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-sm font-medium text-gray-700">Neutral</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{stats.neutral}</div>
                    <div className="text-xs text-gray-500">{neutralPercent.toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium text-gray-700">Negative</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{stats.negative}</div>
                    <div className="text-xs text-gray-500">{negativePercent.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
              
              {/* Filter Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedFilter("all")}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedFilter === "all"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setSelectedFilter("positive")}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedFilter === "positive"
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Positive ({stats.positive})
                </button>
                <button
                  onClick={() => setSelectedFilter("neutral")}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedFilter === "neutral"
                      ? "bg-gray-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Neutral ({stats.neutral})
                </button>
                <button
                  onClick={() => setSelectedFilter("negative")}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedFilter === "negative"
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Negative ({stats.negative})
                </button>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredReviews.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No reviews found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {selectedFilter === "all" 
                    ? "Reviews will appear here once users submit feedback"
                    : `No ${selectedFilter} reviews found`
                  }
                </p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {review.userEmail ? review.userEmail[0].toUpperCase() : "U"}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-900">
                          {review.userEmail || "Anonymous"}
                        </span>
                        {getRatingStars(review.sentiment)}
                      </div>
                      
                      <p className="text-gray-700 mb-3 leading-relaxed">{review.text}</p>
                      
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