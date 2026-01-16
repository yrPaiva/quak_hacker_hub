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

function formatTimeAgo(timestamp: number): string {
  const now = Date.now() / 1000
  const diff = now - timestamp

  if (diff < 3600) {
    return `${Math.floor(diff / 60)} minutes ago`
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)} hours ago`
  } else {
    return `${Math.floor(diff / 86400)} days ago`
  }
}

function extractDomain(url?: string): string {
  if (!url) return "news.ycombinator.com"
  try {
    const domain = new URL(url).hostname
    return domain.replace("www.", "")
  } catch {
    return "news.ycombinator.com"
  }
}

export function StoryCard({ story, index }: StoryCardProps) {
  const discussionUrl = `https://news.ycombinator.com/item?id=${story.id}`
  const storyUrl = story.url || discussionUrl

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors p-6 group">
      <div className="flex gap-4">
        <div className="flex-shrink-0 text-muted-foreground font-mono text-sm pt-1">{index}.</div>

        <div className="flex-1 space-y-3">
          <div>
            <a
              href={storyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors text-lg font-medium leading-snug inline-flex items-start gap-2 group/link"
            >
              <span className="text-balance">{story.title}</span>
              <ArrowUpRight className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0 mt-1" />
            </a>
            <div className="text-sm text-muted-foreground mt-1">{extractDomain(story.url)}</div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="font-medium">{story.score}</span>
              <span>points</span>
            </div>

            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span>{story.by}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTimeAgo(story.time)}</span>
            </div>

            {/* Leva para o forum de dialogo da noticia */}
            <a
              href={discussionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{story.descendants || 0} comments</span>
            </a>
          </div>
        </div>
      </div>
    </Card>
  )
}
