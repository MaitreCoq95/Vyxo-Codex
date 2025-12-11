"use client"

import { MobileSidebar } from "@/components/layout/sidebar"
import { cn } from "@/lib/utils"
import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"

export function Header() {
  const { t } = useLanguage()
  return (
    <div className="fixed top-0 w-full z-50 flex items-center h-16 px-4 border-b border-white/10 bg-vyxo-navy/80 backdrop-blur-md transition-all duration-300">
      <MobileSidebar />
      
      <div className="hidden md:flex items-center ml-4 md:ml-64 transition-all duration-300">
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <Input 
                type="search" 
                placeholder={t("header.searchPlaceholder")} 
                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-400 w-[200px] lg:w-[300px] focus-visible:ring-vyxo-gold focus-visible:ring-offset-0"
            />
        </div>
      </div>

      <div className="ml-auto flex items-center space-x-4">
        <LanguageSwitcher />
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white hover:bg-white/10">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-vyxo-gold rounded-full animate-pulse"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full ring-2 ring-vyxo-gold/50 hover:ring-vyxo-gold transition-all">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="@vyxo" />
                <AvatarFallback className="bg-vyxo-navy text-vyxo-gold font-bold">VC</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{t("header.vyxoConsultant")}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@vyxo.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {t("header.profile")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {t("header.settings")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {t("header.billing")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600">
              {t("header.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
