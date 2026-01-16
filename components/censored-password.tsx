"use client"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export function CensoredPassword({ password }: { password: string }) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 rounded border border-primary/20 hover:border-red-500/50 transition-all cursor-help group"
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
    >
      {isRevealed ? <Eye className="w-3 h-3 text-red-500" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
      <span className="font-mono text-xs">
        {isRevealed ? (
          <span className="text-red-500 font-bold tracking-widest">{password}</span>
        ) : (
          <span className="text-muted-foreground">********</span>
        )}
      </span>
    </div>
  )
}