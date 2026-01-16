"use client"

import { useEffect, useState, useCallback } from "react"
import { Terminal, AlertTriangle, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoadingSkeleton from "@/components/skeleton"
export default function CVEFeed() {
  const [cves, setCves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [startIndex, setStartIndex] = useState(0)

  const fetchCVEs = useCallback(async (index: number, isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await fetch(`/api/cves?startIndex=${index}`);
      const data = await res.json();
      
      if (isLoadMore) {
        setCves(prev => [...prev, ...data.cves]);
      } else {
        setCves(data.cves || []);
      }
    } catch (error) {
      console.error("Erro ao carregar CVEs:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchCVEs(0);
  }, [fetchCVEs]);

  const handleLoadMore = () => {
    const nextIndex = startIndex + 10;
    setStartIndex(nextIndex);
    fetchCVEs(nextIndex, true);
  };

  const formatDateBR = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl font-mono">
      <div className="mb-10 border-l-4 border-primary pl-4">
        <h2 className="text-2xl font-black uppercase tracking-widest">Registro de vulnerabilidades</h2>
        <p className="text-xs text-primary/60 italic">Monitorando falhas de 2025/2026 em tempo real</p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {cves.map((cve: any) => (
              <div key={cve.id} className="group border border-white/5 p-4 hover:bg-white/5 transition-all flex flex-col md:flex-row gap-4 items-start">
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <span className="text-primary font-bold">{cve.id}</span>
                  <span className="text-[10px] text-primary/40">{formatDateBR(cve.published)}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                      cve.severity === 'CRITICAL' ? 'text-red-500 border-red-500/30 bg-red-500/10' : 'text-orange-500 border-orange-500/30 bg-orange-500/10'
                    }`}>
                      {cve.severity}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase">Score: {cve.score}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    {cve.description}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-8">
              <Button 
                onClick={handleLoadMore} 
                disabled={loadingMore}
                variant="outline" 
                className="font-black uppercase italic tracking-widest border-primary/20 hover:bg-primary/5 px-12 h-12 cursor-pointer mb-10 lg:mb-4"
              >
                {loadingMore ? <Loader2 className="animate-spin mr-2" /> : "Carregar Mais_"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* <div className="mt-12 p-4 border border-dashed border-primary/20 rounded opacity-50 text-[11px] text-center">
        <p>Cálculo de Prioridade Baseado em Severidade (CVSS v3.1):</p>
        <p className="mt-2 text-primary">$$Score = \text{BaseScore} \times \text{Impact} \times \text{Exploitability}$$</p>
      </div> */}
    </div>
  )
}