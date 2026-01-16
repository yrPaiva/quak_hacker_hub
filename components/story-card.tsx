import { ArrowUpRight, MessageSquare, User, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"

interface StoryCardProps {
  story: {
    id: number
    title: string
    url?: string
    by: string
    time: number
    score: number
    descendants?: number
  }
  index: number
}


function formatTimeAgoBR(timestamp: number): string {
  const now = Date.now() / 1000
  const diff = now - timestamp
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`
  return `há ${Math.floor(diff / 86400)} dias`
}

function extractDomain(url?: string): string {
  if (!url) return "news.ycombinator.com"
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return "news.ycombinator.com"
  }
}

export function StoryCard({ story, index }: StoryCardProps) {
  const domain = extractDomain(story.url)
  const discussionUrl = `https://news.ycombinator.com/item?id=${story.id}`
  const storyUrl = story.url || discussionUrl

  return (
    <Card className="bg-card/30 border-primary/10 hover:border-primary/40 transition-all p-5 group relative overflow-hidden">
      <div className="flex gap-5">
        <div className="hidden sm:flex w-12 h-12 bg-white rounded-lg p-2 items-center justify-center flex-shrink-0 shadow-lg self-start">
          <img 
            src={`https://unavatar.io/${domain}?fallback=https://ui-avatars.com/api/?name=HN&background=0D9488&color=fff`}
            alt={domain}
            className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-primary/40">#{index.toString().padStart(2, '0')}</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">{domain}</span>
            </div>
            <a
              href={storyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-bold text-lg leading-tight hover:text-primary transition-colors flex items-start gap-2 group/link"
            >
              <span className="text-balance">{story.title}</span>
              <ArrowUpRight className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity mt-1 text-primary" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-mono text-muted-foreground uppercase">
            <div className="flex items-center gap-1.5 text-primary">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-black">{story.score}</span>
              <span>pontos</span>
            </div>

            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3" />
              <span>{story.by}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgoBR(story.time)}</span>
            </div>

            <a
              href={discussionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-primary transition-colors border-l border-white/10 pl-4"
            >
              <MessageSquare className="h-3 w-3" />
              <span>{story.descendants || 0} comentários</span>
            </a>
          </div>
        </div>
      </div>
    </Card>
  )
}