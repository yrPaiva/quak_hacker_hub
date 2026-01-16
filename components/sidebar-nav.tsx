// components/sidebar-nav.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "DeepScan" },
    { href: "/news", label: "QuakNews" },
    { href: "/breaches", label: "Global Leaks" },
    { href: "/vulnerabilities", label: "CVE Feed" },
  ];

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg transition-all border",
              isActive 
                ? "bg-primary/10 text-primary border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                : "text-muted-foreground border-transparent hover:bg-white/5"
            )}
          >
            <span className={cn("w-2 h-2 rounded-full bg-primary opacity-0", isActive && "opacity-100 animate-pulse")} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}