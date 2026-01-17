"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Send } from "lucide-react"

const API_BASE =
  "https://delia-ayu-nandhita-chatbot-sentimen.hf.space"

type Message = {
  id: string
  text: string
  sender: "user" | "bot"
}

export default function ChatBotBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg.text }),
      })

      const data = await res.json()

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer ?? "Maaf, saya belum bisa menjawab.",
        sender: "bot",
      }

      setMessages((prev) => [...prev, botMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Gagal menghubungi server.",
          sender: "bot",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-4 w-90 h-125 bg-white border shadow-xl rounded-xl flex flex-col z-50">
          <div className="p-3 bg-emerald-600 text-white flex justify-between rounded-t-xl">
            CarbonScan Bot
            <button onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg text-sm max-w-[75%] ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-xs text-gray-400">
                CarbonScan sedang mengetik…
              </p>
            )}
          </div>

          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Tanya tentang karbon…"
              className="flex-1 border rounded px-3 py-2 text-sm"
            />
            <button
              onClick={sendMessage}
              className="bg-emerald-600 text-white px-3 py-2 rounded"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* CHATBOT BUBBLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 z-50"
          style={{
            animation: "wiggle 1.8s ease-in-out infinite",
          }}
        >
          <Image
            src="/chatbot.png"
            alt="Chatbot"
            width={56}
            height={56}
            className="rounded-full cursor-pointer"
          />
        </button>

        {/* INLINE KEYFRAMES */}
        <style jsx>{`
          @keyframes wiggle {
            0%, 100% {
              transform: rotate(-6deg);
            }
            50% {
              transform: rotate(6deg);
            }
          }
        `}</style>
    </>
  )
}
