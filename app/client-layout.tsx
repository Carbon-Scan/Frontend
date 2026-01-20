"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import ChatBotBubble from "@/components/chatbot-bubble"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isPageLoading, setIsPageLoading] = useState(false)

  // Deteksi loading state dari body class
  useEffect(() => {
    const checkLoading = () => {
      setIsPageLoading(document.body.classList.contains("page-loading"))
    }

    // Check initial state
    checkLoading()

    // Setup MutationObserver untuk memantau perubahan class di body
    const observer = new MutationObserver(checkLoading)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  const hideChatbot =
    pathname === "/login" || 
    pathname === "/register" ||
    pathname?.startsWith("/admin") ||
    isPageLoading 

  return (
    <>
      {children}
      {!hideChatbot && <ChatBotBubble />}
    </>
  )
}