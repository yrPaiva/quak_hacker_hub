import { StoryFeed } from "@/components/story-feed"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <StoryFeed />
      </main>
    </div>
  )
}
