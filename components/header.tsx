import { Terminal } from "lucide-react"
import QuakNews from '@/public/QuakNews.png'
import Image from "next/image"

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 max-w-4xl justify-between flex items-center">
        <div className="flex items-center gap-3">
          <Image src={QuakNews} alt="Logo" className="w-18 h-18"/>
          
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hacker News</h1>
            <p className="text-sm text-muted-foreground">Últimas notícias do mundo hacker</p>
          </div>
        </div>
        {/* <Terminal className="h-7 w-7 text-primary" /> */}
      </div>
    </header>
  )
}
