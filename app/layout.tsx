import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { NavShell } from "@/components/nav-sell"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "QuakSec | Cyber Intel Hub",
    template: "%s | QuakSec"
  },
  description: "Plataforma de inteligência OSINT, monitoramento de vazamentos e feed de vulnerabilidades em tempo real.",
  keywords: ["cibersegurança", "vazamentos", "CVE", "OSINT", "hacker news"],
  authors: [{ name: "Yan Paiva" }],
  icons: {
    icon: "/QuakNews.png",
    apple: "/QuakNews.png",
  },
  openGraph: {
    title: "QuakSec - Intelligence Platform",
    description: "Verifique vazamentos e acompanhe ameaças cibernéticas.",
    url: "https://yanrpaiva.vercel.app",
    siteName: "QuakSec",
    locale: "pt_BR",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className="dark" suppressHydrationWarning>
      <body className={`${jetbrainsMono.className} antialiased`}>
        <NavShell>
          {children}
        </NavShell>
      </body>
    </html>
  )
}