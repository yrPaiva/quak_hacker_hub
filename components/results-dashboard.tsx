"use client"

import { motion } from "framer-motion"
import { Shield, ArrowLeft, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SecurityGauge } from "@/components/security-gauge"
import { BreachCard } from "@/components/breach-card"
import { ExposureRadar } from "@/components/exposure-radar"

interface ResultsDashboardProps {
  email: string;
  data: any; 
  onNewScan: () => void;
}

const mockBreaches = [
  {
    site: "LinkedIn Archive",
    date: "Junho 2021",
    records: "700M+",
    severity: "high" as const,
    description: "Dados de perfil profissional e e-mail detectados.",
    passwordHint: "link****",
  },
  {
    site: "Adobe Legacy",
    date: "Outubro 2013",
    records: "153M",
    severity: "critical" as const,
    description: "E-mail e senha com hash antigo detectados.",
    passwordHint: "adob****",
  },
]

export function ResultsDashboard({ email, onNewScan, data }: ResultsDashboardProps) {
  const isDemo = data?.mode === "DEMO";
  const isSafe = data?.mode === "SAFE";

  const allBreaches = isDemo 
    ? [...mockBreaches, ...(data?.open_source_leaks || [])] 
    : [...(data?.breaches || []), ...(data?.open_source_leaks || [])];

  const riskScore = isSafe ? 0 : (data?.riskScore || 0);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {isDemo && (
        <motion.div 
          initial={{ skewX: 20, opacity: 0 }}
          animate={{ skewX: 0, opacity: 1 }}
          className="bg-red-950/40 border border-red-500 p-3 text-center text-xs font-mono text-red-500 rounded-md relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
          <span className="relative z-10 font-bold tracking-tighter">
            [!] AVISO: LIMITE DA API ATINGIDO. EXIBINDO DADOS DE SIMULAÇÃO (DEMO_MODE) [!]
          </span>
        </motion.div>
      )}

      {isSafe ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="p-12 border-primary/30 bg-card/50 backdrop-blur-sm text-center">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4 neon-pulse" />
            <h3 className="text-2xl font-bold text-primary mb-2 tracking-tighter">INTEGRIDADE CONFIRMADA</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Nenhuma vulnerabilidade crítica detectada para <span className="text-foreground font-mono">{email}</span>. 
              Sua conta não consta nos registros de vazamentos atuais.
            </p>
            <Button onClick={onNewScan} className="mt-8 border-primary text-primary hover:bg-primary/10 cursor-pointer" variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Nova Varredura
            </Button>
          </Card>
        </motion.div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <Button variant="ghost" onClick={onNewScan} className="w-fit text-primary -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
            <h2 className="text-2xl font-bold tracking-tighter">
              RELATÓRIO DE EXPOSIÇÃO: <span className="text-primary font-mono">{email}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 border-primary/30 bg-card/50 backdrop-blur-sm flex flex-col items-center justify-center">
              <SecurityGauge score={riskScore} />
            </Card>

            <Card className="p-6 border-primary/30 bg-card/50 backdrop-blur-sm lg:col-span-2">
              <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-widest">
                Vetores de Ataque Detectados
              </h4>
              <ExposureRadar score={riskScore} breaches={allBreaches} />
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                 <Database className="w-5 h-5 text-primary" />
                 Registros de Vulnerabilidade
               </h3>
               <span className="text-xs font-mono text-muted-foreground">Total: {allBreaches.length}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {allBreaches.length > 0 ? (
                allBreaches.map((breach: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <BreachCard {...breach} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center border border-dashed border-primary/20 rounded-lg text-muted-foreground italic">
                  Nenhum registro adicional encontrado em bases open-source.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}