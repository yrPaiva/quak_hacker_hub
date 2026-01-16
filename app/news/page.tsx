import { StoryFeed } from "@/components/story-feed"
import { Newspaper } from "lucide-react"

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in duration-500">
      <div className="mb-10 border-l-4 border-primary pl-4">
        <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
          <Newspaper className="text-primary w-8 h-8" /> Hacker <span className="text-primary">News</span>
        </h2>
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
          Inteligência de mercado via HackerNews API v0
        </p>
      </div>
      
      <StoryFeed />
    </div>
  )
}