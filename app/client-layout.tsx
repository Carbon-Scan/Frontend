"use client"

import { usePathname } from "next/navigation"
import ChatBotBubble from "@/components/chatbot-bubble"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const hideChatbot =
    pathname === "/login" || pathname === "/register"

  return (
    <>
      {children}
      {!hideChatbot && <ChatBotBubble />}
    </>
  )
}