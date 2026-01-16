import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HackerFeed - Latest Tech News",
  description: "Stay updated with the latest news from the hacker world",
  generator: "hacker-neews",
  icons: {
    icon: [
      {
        url: "/QuakNews.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/QuakNews.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/QuakNews.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/QuakNews.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
