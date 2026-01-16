"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SecurityGaugeProps {
  score: number
}

export function SecurityGauge({ score }: SecurityGaugeProps) {
  // Garantia de que o score esteja entre 0 e 100
  const normalizedScore = Math.min(Math.max(score, 0), 100)
  const circumference = 2 * Math.PI * 90
  const offset = circumference - (normalizedScore / 100) * circumference
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    if (normalizedScore === 0) {
      setDisplayScore(0)
      return
    }

    let start = 0
    const duration = 1500
    const increment = duration / normalizedScore

    const timer = setInterval(() => {
      start += 1
      setDisplayScore(start)
      if (start >= normalizedScore) clearInterval(timer)
    }, increment)

    return () => clearInterval(timer)
  }, [normalizedScore])

  
  const getColor = (s: number) => {
    if (s < 30) return "text-primary" // #0D9488
    if (s < 60) return "text-amber-500"
    return "text-red-600"
  }

  return (
    <div className="flex flex-col items-center justify-center font-mono">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-primary/5"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={cn("transition-colors duration-500", getColor(normalizedScore))}
            style={{
               filter: `drop-shadow(0 0 8px currentColor)`,
            }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("text-5xl font-black italic tracking-tighter", getColor(normalizedScore))}
          >
            {displayScore}
          </motion.span>
          <span className="text-[10px] uppercase opacity-40">Security_Level</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 text-center space-y-1"
      >
        <p className={cn("text-sm font-black uppercase italic tracking-widest", getColor(normalizedScore))}>
          {normalizedScore < 30 ? "PROTOCOL_SAFE" : normalizedScore < 60 ? "PROTOCOL_WARNING" : "PROTOCOL_CRITICAL"}
        </p>
        <p className="text-[10px] text-muted-foreground uppercase">
          {normalizedScore < 30 
            ? "Integridade de dados confirmada" 
            : normalizedScore < 60 
              ? "Exposição parcial detectada" 
              : "Vazamento crítico identificado"}
        </p>
      </motion.div>
    </div>
  )
}