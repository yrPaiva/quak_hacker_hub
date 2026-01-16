import { Timer, Loader2 } from 'lucide-react';

export function RateLimitAlert({ seconds, pending }: { seconds: number, pending: boolean }) {
  return (
    <div className="bg-amber-900/40 border border-amber-500/50 p-4 rounded-lg flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-3">
        <Timer className="text-amber-500 animate-bounce" />
        <div>
          <p className="text-amber-200 font-bold text-sm">MOTOR EM RESFRIAMENTO</p>
          <p className="text-amber-400/80 text-xs">
            Limite da API atingido. Aguarde {seconds}s para a próxima varredura.
          </p>
        </div>
      </div>
      {pending && (
        <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
          <Loader2 className="w-3 h-3 text-amber-500 animate-spin" />
          <span className="text-[10px] text-amber-200 uppercase font-black">Na Fila</span>
        </div>
      )}
    </div>
  );
}