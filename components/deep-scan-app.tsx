"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Timer, Loader2, ShieldCheck, Zap, Activity, Terminal as TerminalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Terminal } from "@/components/terminal"
import { ResultsDashboard } from "@/components/results-dashboard"

export default function DeepScanPage() {
  const [email, setEmail] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [terminalLogs, setTerminalLogs] = useState<string[]>([])
  const [scanData, setScanData] = useState<any>(null)

  const [isRateLimited, setIsRateLimited] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRateLimited && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0 && isRateLimited) {
      setIsRateLimited(false);
      if (pendingEmail) {
        handleScan(pendingEmail);
        setPendingEmail(null);
      }
    }
    return () => clearInterval(timer);
  }, [isRateLimited, countdown, pendingEmail]);

  const handleScan = async (targetEmail = email) => {
    if (!targetEmail) return;

    setIsScanning(true);
    setShowResults(false);
    setTerminalLogs(["> Estabelecendo conexão segura com gateways OSINT..."]);

    try {
      const response = await fetch(`/api/scan?email=${encodeURIComponent(targetEmail)}`);
      const data = await response.json();

      if (response.status === 429) {
        setIsRateLimited(true);
        setCountdown(data.retryAfter || 2);
        setTerminalLogs(prev => [...prev, "> [WARNING] Limite de requisições atingido.", "> [QUEUE] Varredura agendada."]);
        setIsScanning(false);
        return;
      }

      const logs = [
        "> [OK] Database 2026 sincronizada.",
        "> Analisando padrões de exposição PII...",
        data.mode === "SAFE" ? "> [INFO] Nenhum registro de exposição encontrado." : `> [ALERT] ${data.breaches?.length} ameaças encontradas.`
      ];

      for (const log of logs) {
        await new Promise(r => setTimeout(r, 400));
        setTerminalLogs(prev => [...prev, log]);
      }

      setScanData(data);
      setIsScanning(false);
      setShowResults(true);
    } catch (error) {
      setTerminalLogs(prev => [...prev, "> [CRITICAL_ERROR] Falha na comunicação com o banco de dados."]);
      setIsScanning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-12 max-w-7xl animate-in fade-in duration-700">
      
      {/* STATUS DE COOLDOWN */}
      {isRateLimited && (
        <div className="mb-6 max-w-2xl mx-auto flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 animate-pulse" />
            <span>SISTEMA EM RESFRIAMENTO</span>
          </div>
          <span className="font-bold">{countdown}S</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div key="search" className="space-y-12">
            
            {/* HERO SECTION */}
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
                Deep<span className="text-primary">Scan</span>
              </h2>
              <p className="text-muted-foreground font-mono text-sm md:text-base max-w-xl mx-auto">
                Protocolo de busca em 16B+ registros de vazamentos e logs de malware.
              </p>
            </div>

            {/* BARRA DE BUSCA */}
            <div className="relative max-w-2xl mx-auto">
              <Card className="p-2 md:p-3 border-primary/20 bg-card/50 backdrop-blur-md shadow-2xl">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                    <Input
                      type="email"
                      placeholder="investigar@alvo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleScan()}
                      className="pl-10 h-12 bg-transparent border-none focus-visible:ring-0 font-mono text-lg"
                    />
                  </div>
                  <Button
                    onClick={() => handleScan()}
                    disabled={isScanning || !email}
                    className="h-12 px-8 font-black uppercase italic"
                  >
                    {isScanning ? <Loader2 className="animate-spin w-4 h-4" /> : <Zap className="w-4 h-4 mr-2" />}
                    {isScanning ? "Scanning..." : "Escanear"}
                  </Button>
                </div>
              </Card>
            </div>

            {/* FEATURES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
               <Feature icon={ShieldCheck} label="Fila Inteligente" desc="Você entrará em uma fila caso esteja congestionado" />
               <Feature icon={Activity} label="Logs de Malware" desc="Lumma & Naz.API Intel" />
               <Feature icon={TerminalIcon} label="Protocolo OSINT" desc="Verificação HIBP v3" />
            </div>

            {/* TERMINAL DE LOGS */}
            {(isScanning || terminalLogs.length > 0) && (
              <div className="max-w-2xl mx-auto">
                <Terminal logs={terminalLogs} isActive={isScanning} />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
            <ResultsDashboard
              email={email}
              onNewScan={() => { setShowResults(false); setEmail(""); setTerminalLogs([]); }}
              data={scanData}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Feature({ icon: Icon, label, desc }: any) {
  return (
    <Card className="p-4 border-primary/10 bg-card/20 hover:border-primary/30 transition-all text-center">
      <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
      <h4 className="text-[15px] font-black uppercase text-primary/80">{label}</h4>
      <p className="text-[10px] text-muted-foreground">{desc}</p>
    </Card>
  )
}