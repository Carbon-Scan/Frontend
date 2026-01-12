"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { MessageCircle, X, Send } from "lucide-react"

type Message = {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatBotBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Tooltip auto muncul
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const userInput = input
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch("YOUR_API_ENDPOINT_HERE", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      })

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.message || "Maaf, terjadi kesalahan.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Maaf, terjadi kesalahan. Silakan coba lagi.",
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-90 bg-white shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
          <div className="p-4 bg-emerald-600 text-white font-semibold flex justify-between">
            Asisten CarbonScan
            <button onClick={() => setIsOpen(false)}>
              <X />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3 min-h-100">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="text-gray-400 text-sm">Bot sedang mengetik...</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ketik pesan..."
              className="flex-1 border px-3 py-2 text-sm"
            />
            <button
              onClick={handleSend}
              className="bg-emerald-600 text-white px-3 py-2"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* TOOLTIP */}
      {showTooltip && !isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-tooltip">
          <div className="bg-emerald-600 text-white text-sm px-4 py-2 shadow-lg relative">
            Butuh bantuan?
            <span className="absolute -bottom-1.5 right-6 w-3 h-3 bg-emerald-600 rotate-45"></span>
          </div>
        </div>
      )}

      {/* CHAT BUBBLE */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          setShowTooltip(false)
        }}
        className="
          fixed bottom-6 right-4 sm:right-6
          w-16 h-16 rounded-full bg-white
          shadow-[0_0_20px_rgba(16,185,129,0.6)]
          flex items-center justify-center
          z-50 animate-float
        "
      >
        <Image
          src="https://img.freepik.com/premium-vector/chatbot-icon-concept-chat-bot-chatterbot-robot-virtual-assistance-website_123447-1615.jpg?w=1380"
          alt="Chatbot"
          width={56}
          height={56}
          className="rounded-full"
        />
      </button>
    </>
  )
}
