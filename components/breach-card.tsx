"use client"

import { AlertTriangle, Calendar, Database, Key, ShieldCheck, Fingerprint } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CensoredPassword } from "@/components/censored-password"

interface BreachCardProps {
  site: string
  date: string
  records: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  passwordHint?: string | null
  leakedData?: string[] 
}

const getBadgeColor = (data: string) => {
  const d = data.toLowerCase();
  if (d.includes('password')) return 'bg-red-500/20 text-red-400 border-red-500/30';
  if (d.includes('email') || d.includes('username')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  if (d.includes('ip address') || d.includes('location')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  if (d.includes('birth') || d.includes('name')) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
};

export function BreachCard({ 
  site, 
  date, 
  records, 
  severity, 
  description, 
  passwordHint,
  leakedData = []
}: BreachCardProps) {
  
  const hasPassword = !!passwordHint;

  const severityColors = {
    low: "border-primary/20 bg-primary/5",
    medium: "border-yellow-500/20 bg-yellow-500/5",
    high: "border-orange-500/20 bg-orange-500/5",
    critical: "border-destructive/30 bg-destructive/10",
  }

  return (
    <Card className={`p-4 border-2 ${severityColors[severity]} backdrop-blur-sm transition-all hover:border-primary/50 flex flex-col h-full min-w-0`}>
      <div className="flex items-start gap-3 mb-3 min-w-0">
        <div className="flex-shrink-0 w-10 h-10 bg-muted/30 rounded-lg flex items-center justify-center">
          <AlertTriangle className={`w-5 h-5 ${hasPassword ? 'text-destructive' : 'text-primary'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-foreground text-sm md:text-base leading-tight break-words line-clamp-2 mb-1">
            {site}
          </h4>
          <Badge variant="outline" className="text-[9px] uppercase tracking-tighter opacity-70">
            {records} contas
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-3 text-[11px] font-mono text-muted-foreground">
        <Calendar className="w-3 h-3" /> {date}
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed mb-4 line-clamp-3">
        {description}
      </p>

      {/* SEÇÃO DE BADGES (PII EXPOSTO) */}
      <div className="flex flex-col">
        <p>Informações Expostas:</p>
        <div className="flex flex-wrap gap-1 mb-4 mt-auto">
          {leakedData.map((item, idx) => (
            <span 
            key={idx} 
            className={`text-[8px] md:text-[9px] uppercase font-black px-1.5 py-0.5 rounded border leading-none ${getBadgeColor(item)}`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* STATUS DE CREDENCIAL */}
      <div className={`pt-3 border-t ${hasPassword ? 'border-destructive/20' : 'border-primary/10'}`}>
        {hasPassword ? (
          <div className="flex items-center justify-between bg-destructive/5 p-2 rounded-md border border-destructive/20 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Key className="w-3.5 h-3.5 text-destructive animate-pulse flex-shrink-0" />
              <span className="text-[9px] font-black text-destructive uppercase tracking-widest truncate">EXPOSTA</span>
            </div>
            <CensoredPassword password={passwordHint} />
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-md border border-primary/10">
            <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="text-[9px] font-black text-primary uppercase tracking-widest">Senha Segura</span>
          </div>
        )}
      </div>
    </Card>
  )
}