/**
 * Vyxo Finance Hub - Layout
 * Layout avec navigation pour le module Finance
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Dashboard',
    href: '/finance',
    icon: LayoutDashboard,
  },
  {
    name: 'P&L',
    href: '/finance/pl',
    icon: FileText,
  },
  {
    name: 'Cash Flow',
    href: '/finance/cashflow',
    icon: Wallet,
  },
  {
    name: 'Scénarios',
    href: '/finance/scenarios',
    icon: TrendingUp,
  },
  {
    name: 'Anomalies',
    href: '/finance/anomalies',
    icon: AlertTriangle,
  },
  {
    name: 'Assistant IA',
    href: '/finance/assistant',
    icon: Lightbulb,
  },
]

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="sticky top-6">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
