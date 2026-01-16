"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Globe, Loader2 } from "lucide-react"
import LoadingSkeleton from "@/components/skeleton"

export default function GlobalBreaches() {
  const [breaches, setBreaches] = useState<any[]>([])
  const [displayCount, setDisplayCount] = useState(10)
  const [loading, setLoading] = useState(true)

  const LOGO_SERVICE_URL = "https://unavatar.io/";

  useEffect(() => {
    fetch('/api/breaches')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setBreaches(sorted);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <h2 className="text-2xl font-black mb-10 italic border-b border-primary/20 pb-4 flex items-center gap-2">
        <Globe className="text-primary" /> HISTÓRICO_GLOBAL_DE INVASÕES
      </h2>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {breaches.slice(0, displayCount).map((leak, i) => (
            <div key={i} className="group p-6 border border-primary/10 bg-card/30 backdrop-blur-md rounded-xl hover:border-primary/40 transition-all flex flex-col gap-4">
              
              <div className="flex items-center gap-4">
                {/* CONTAINER DA IMAGEM */}
                <div className="w-14 h-14 bg-white rounded-lg p-2 flex items-center justify-center flex-shrink-0 shadow-xl overflow-hidden border border-primary/10">
                  <img 
                    // Usamos o domínio para garantir que o logo correto seja encontrado
                    src={`${LOGO_SERVICE_URL}${leak.domain}?fallback=https://ui-avatars.com/api/?name=${leak.site}&background=random`} 
                    alt={`Logo de ${leak.site}`}
                    className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                    loading="lazy"
                    onError={(e) => {
                      // Caso até o serviço de logo falhe, usamos um placeholder neutro
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${leak.site}&background=0D9488&color=fff`;
                    }}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-black text-primary leading-none uppercase italic">{leak.site}</h3>
                    <span className="text-[10px] opacity-50 font-mono">
                      {new Date(leak.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1">{leak.domain}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 italic leading-relaxed border-t border-primary/5 pt-4">
                {leak.description}
              </p>
            </div>
          ))}
          </div>
          {displayCount < breaches.length && (
            <div className="flex justify-center">
              <Button 
                onClick={() => setDisplayCount(prev => prev + 10)} 
                variant="outline" 
                className="font-black uppercase italic tracking-widest border-primary/20 hover:bg-primary/5 px-12 h-12 cursor-pointer mb-10 lg:mb-4"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Carregar Mais_"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}