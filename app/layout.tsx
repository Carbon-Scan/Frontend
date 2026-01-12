import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ChatBotBubble from "@/components/chatbot-bubble"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CarbonScan",
  description: "Monitor emisi karbon Anda",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
        <ChatBotBubble />
      </body>
    </html>
  )
}