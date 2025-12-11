"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileText,
  FolderOpen,
  Bot,
  Settings,
  LogOut,
  Menu,
  Target,
  BookOpen,
  Lightbulb,
  FolderKanban,
  Building2,
  LineChart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useLanguage()

  const routes = [
    {
      label: t("nav.dashboard"),
      icon: LayoutDashboard,
      href: "/",
      color: "text-sky-500",
    },
    {
      label: t("nav.clients"),
      icon: Users,
      href: "/clients",
      color: "text-violet-500",
    },
    {
      label: t("nav.prospecting"),
      icon: Target,
      href: "/prospecting",
      color: "text-amber-500",
    },
    {
      label: "VyxHunter",
      icon: Bot,
      href: "/vyxhunter",
      color: "text-purple-500",
    },
    {
      label: t("nav.emailgen"),
      icon: Bot,
      href: "/prospecting/email-generator",
      color: "text-indigo-500",
    },
    {
      label: t("nav.audits"),
      icon: ClipboardCheck,
      href: "/audits",
      color: "text-pink-700",
    },
    {
      label: "Vyxo Codir",
      icon: Building2,
      href: "/vyxo-codir",
      color: "text-blue-500",
    },
    {
      label: "CODIR Dashboard",
      icon: Building2,
      href: "/codir-dashboard",
      color: "text-indigo-600",
    },
    {
      label: "Vyxo Bucket",
      icon: Lightbulb,
      href: "/vyxo-bucket",
      color: "text-yellow-500",
    },
    {
      label: "Vyxo Projets",
      icon: FolderKanban,
      href: "/vyxo-projets",
      color: "text-green-500",
    },
    {
      label: "Finance Hub",
      icon: LineChart,
      href: "/finance",
      color: "text-rose-500",
    },
    {
      label: t("nav.documents"),
      icon: FolderOpen,
      href: "/documents",
      color: "text-emerald-500",
    },
    {
      label: t("nav.codex"),
      icon: BookOpen,
      href: "/codex",
      color: "text-cyan-500",
    },
    {
      label: t("nav.settings"),
      icon: Settings,
      href: "/settings",
      color: "text-zinc-400",
    },
  ]

  return (
    <div className={cn("pb-12 min-h-screen bg-vyxo-navy", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <Link href="/" className="flex items-center pl-3 mb-14">
            <div className="relative w-10 h-10 mr-3">
              <Image 
                src="/vyxo-logo.png" 
                alt="Vyxo Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              Vyxo <span className="text-vyxo-gold">Central Hub</span>
            </h1>
          </Link>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                  pathname === route.href 
                    ? "text-white bg-white/10 border-r-4 border-vyxo-gold" 
                    : "text-zinc-400"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="px-3 py-2 mt-auto absolute bottom-0 w-full">
            <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-red-500 hover:bg-red-500/10">
                    <LogOut className="h-5 w-5 mr-3" />
                    {t("nav.logout")}
                </Button>
            </div>
        </div>
      </div>
    </div>
  )
}

export function MobileSidebar() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-vyxo-navy border-r-vyxo-gold/20 w-72 text-white">
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
}
