"use client"

import { usePathname } from "next/navigation"
import { Shield, Newspaper, Globe, Terminal, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import QuakScann from "@/public/QuakScann.png"
import hackerQuak from "@/public/hackerQuak.png"

const NAV_ITEMS = [
  { href: "/", label: "Scan", icon: Search },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/breaches", label: "Leaks", icon: Globe },
  { href: "/vulnerabilities", label: "CVEs", icon: Terminal },
]

export function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden text-foreground bg-background">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex w-64 border-r border-primary/10 bg-card/20 backdrop-blur-xl p-6 flex-col">
        <div className="flex flex-col items-center gap-3 mb-8 relative mt-8">
          <Image src={hackerQuak} alt="Logo" width={80} height={80} className="absolute -top-8 left-12.5" />
          <h1 className="text-xl font-black tracking-tighter uppercase italic mt-6 flex items-center">
            Quak<span className="text-primary">Sec</span>
            <Shield className="text-primary w-6 h-6 animate-pulse ml-2" />
          </h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} active={pathname === item.href} />
          ))}
        </nav>

        <div className="mt-auto text-[10px] text-primary/40 text-center border border-primary/10 p-2 rounded font-mono uppercase tracking-widest">
          VASCO 💢
        </div>
      </aside>

      {/* --- MOBILE HEADER --- */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-primary/10 bg-background/80 backdrop-blur-md z-50">
        <div className="flex flex-col items-center gap-3 mb-2 relative mt-6">
          <Image src={hackerQuak} alt="Logo" width={80} height={80} className="absolute -top-8 right-6" />
          <h1 className="text-xl font-black tracking-tighter uppercase italic mt-6 flex items-center">
            Quak<span className="text-primary">Sec</span>
            <Shield className="text-primary w-5 h-5 animate-pulse ml-2" />
          </h1>
        </div>
        <div className="text-[10px] font-mono text-primary animate-pulse uppercase tracking-tighter border border-primary/20 px-2 py-1 rounded">
          Live_Intel
        </div>
      </header>

      {/* --- ÁREA DE CONTEÚDO --- */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 relative">
        <div className="w-full h-full">
          {children}
        </div>
      </main>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/90 backdrop-blur-xl border-t border-primary/10 flex items-center justify-around px-2 z-50">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-muted-foreground opacity-60 hover:opacity-100"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                isActive && "bg-primary/10 shadow-[0_0_10px_rgba(var(--primary),0.2)]"
              )}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

function NavLink({ item, active }: { item: any, active: boolean }) {
  return (
    <Link 
      href={item.href} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all border",
        active 
          ? "bg-primary/10 text-primary border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
          : "text-muted-foreground border-transparent hover:text-primary hover:bg-primary/5"
      )}
    >
      <item.icon className={cn("w-4 h-4", active && "animate-pulse")} />
      <span>{item.label}</span>
    </Link>
  )
}