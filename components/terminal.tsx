"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { TerminalIcon } from "lucide-react"

interface TerminalProps {
  logs: string[]
  isActive: boolean
}

export function Terminal({ logs, isActive }: TerminalProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  return (
    <Card className="border-primary/30 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="bg-slate-900/80 border-b border-primary/20 px-4 py-2 flex items-center gap-2">
        <TerminalIcon className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-primary">Terminal OSINT</span>
        {isActive && (
          <div className="ml-auto flex gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100" />
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200" />
          </div>
        )}
      </div>
      <div className="p-4 font-mono text-sm h-64 overflow-auto bg-slate-950/90">
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={`mb-1 ${
              log.includes("[VAZAMENTO DETECTADO]") || log.includes("[ALERTA]")
                ? "text-destructive font-semibold"
                : log.includes("[OK]") || log.includes("[CONCLUÍDO]")
                  ? "text-primary"
                  : "text-foreground/80"
            }`}
          >
            {log}
          </motion.div>
        ))}
        {isActive && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
            className="text-primary"
          >
            ▋
          </motion.span>
        )}
        <div ref={bottomRef} />
      </div>
    </Card>
  )
}
