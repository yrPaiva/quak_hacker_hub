"use client"

import { useEffect, useState, useCallback } from "react"
import { StoryCard } from "./story-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronDown, Flame, Clock } from "lucide-react"

interface Story {
  id: number
  title: string
  url?: string
  by: string
  time: number
  score: number
  descendants?: number
}

type FeedType = "top" | "new"

interface CacheData {
  stories: Story[]
  allIds: number[]
  displayCount: number
}

export function StoryFeed() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(20)
  const [allStoryIds, setAllStoryIds] = useState<number[]>([])
  const [loadingMore, setLoadingMore] = useState(false)
  const [feedType, setFeedType] = useState<FeedType>("top")

  const [cache, setCache] = useState<{ [key in FeedType]?: CacheData }>({})

  const fetchInitialStories = useCallback(async (type: FeedType) => {
    
    if (cache[type]) {
      const cached = cache[type]!
      setStories(cached.stories)
      setAllStoryIds(cached.allIds)
      setDisplayCount(cached.displayCount)
      setLoading(false)
      return 
    }

    setLoading(true)
    try {
      const endpoint = type === "top" ? "topstories" : "newstories"
      
      // Tem api de TopList e RecentList
      // const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      const res = await fetch(`https://hacker-news.firebaseio.com/v0/${endpoint}.json`)
      const ids = await res.json()
      
      const storyPromises = ids.slice(0, 20).map(async (id: number) => {
        const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        return itemRes.json()
      })

      const storiesData = await Promise.all(storyPromises)
      const filteredStories = storiesData.filter((story) => story && story.title)

      setStories(filteredStories)
      setAllStoryIds(ids)
      setDisplayCount(20)

      //Cache para poder transitar entre as abas sem precisar recarregar os dados da api
      setCache(prev => ({
        ...prev,
        [type]: {
          stories: filteredStories,
          allIds: ids,
          displayCount: 20
        }
      }))
    } catch (error) {
      console.error("QuakDev Fetch Error:", error)
    } finally {
      setLoading(false)
    }
  }, [cache])

  useEffect(() => {
    fetchInitialStories(feedType)
  }, [feedType, fetchInitialStories])

  async function loadMoreStories() {
    setLoadingMore(true)
    try {
      const nextCount = displayCount + 20
      const storyPromises = allStoryIds.slice(displayCount, nextCount).map(async (id: number) => {
        const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        return res.json()
      })

      const newStoriesData = await Promise.all(storyPromises)
      const filteredNewStories = newStoriesData.filter((story) => story && story.title)
      
      const updatedStories = [...stories, ...filteredNewStories]
      
      setStories(updatedStories)
      setDisplayCount(nextCount)

      //Cache para poder transitar entre as abas sem precisar recarregar os dados da api
      setCache(prev => ({
        ...prev,
        [feedType]: {
          stories: updatedStories,
          allIds: allStoryIds,
          displayCount: nextCount
        }
      }))
    } catch (error) {
      console.error("QuakDev Load More Error:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-muted/50 rounded-lg w-fit">
        <Button 
          variant={feedType === "top" ? "default" : "ghost"} 
          size="sm" 
          onClick={() => setFeedType("top")}
          className="gap-2 cursor-pointer"
        >
          <Flame className="h-4 w-4" /> Popular
        </Button>
        <Button 
          variant={feedType === "new" ? "default" : "ghost"} 
          size="sm" 
          onClick={() => setFeedType("new")}
          className="gap-2 cursor-pointer"
        >
          <Clock className="h-4 w-4" /> Recentes
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6 space-y-3">
              <Skeleton className="h-6 w-3/4 bg-muted" />
              <Skeleton className="h-4 w-1/2 bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {stories.map((story, index) => (
              <StoryCard key={`${feedType}-${story.id}`} story={story} index={index + 1} />
            ))}
          </div>

          {displayCount < allStoryIds.length && (
            <div className="flex justify-center pt-4">
              <Button onClick={loadMoreStories} disabled={loadingMore} variant="outline" className={`gap-2 ${loadingMore ? "cursor-not-allowed" : "cursor-pointer"}`}>
                {loadingMore ? "Carregando..." : "Mais notícias"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}