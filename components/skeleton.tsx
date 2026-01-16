import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border border-white/5 p-4 flex flex-col md:flex-row gap-4 items-start">
          {/* Lado Esquerdo: ID e Data */}
          <div className="flex flex-col gap-2 min-w-[140px]">
            <Skeleton className="h-5 w-24 bg-primary/10" />
            <Skeleton className="h-3 w-16 bg-white/5" />
          </div>
          
          {/* Lado Direito: Badge e Descrição */}
          <div className="flex-1 space-y-3 w-full">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16 bg-white/10" />
              <Skeleton className="h-3 w-12 bg-white/5" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full bg-white/5" />
              <Skeleton className="h-3 w-5/6 bg-white/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}