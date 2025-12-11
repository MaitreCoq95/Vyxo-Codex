"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Users, FileText, Activity, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { supabase, type Client, type Invoice, type Audit, type Activity as ActivityType } from "@/lib/supabase"
import { useLanguage } from "@/components/language-provider"

export default function DashboardPage() {
  const { t } = useLanguage()
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeClients: 0,
    pendingAudits: 0,
    revenueGrowth: 0,
    conversionRate: 0,
    totalDeals: 0
  })
  const [activities, setActivities] = useState<ActivityType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        console.log('🔍 Fetching dashboard data from API...')
        
        // Fetch from our server-side API route (bypasses CORS)
        const response = await fetch('/api/dashboard/stats')
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        
        const data = await response.json()
        
        console.log('✅ Data received from API:', data)
        
        setStats(data.stats)
        setActivities(data.activities || [])
        setLoading(false)
      } catch (error) {
        console.error('💥 Error fetching dashboard data:', error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays === 1) return '1d ago'
    return `${diffInDays}d ago`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vyxo-navy mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t("dash.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-vyxo-navy dark:text-white">{t("dash.title")}</h2>
          <p className="text-muted-foreground">{t("dash.subtitle")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-vyxo-navy hover:bg-vyxo-navy/90 text-white">
            <FileText className="mr-2 h-4 w-4" /> {t("dash.newAudit")}
          </Button>
          <Button className="bg-vyxo-gold hover:bg-vyxo-gold/90 text-vyxo-navy font-semibold">
            <Users className="mr-2 h-4 w-4" /> {t("dash.addClient")}
          </Button>
        </div>
      </div>

      {/* BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* REVENUE CARD - LARGE (2x2 on large screens) */}
        <motion.div variants={item} className="col-span-1 md:col-span-2 row-span-2">
          <Card className="h-full border-none shadow-lg bg-gradient-to-br from-vyxo-navy to-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 bg-vyxo-gold/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-zinc-300">{t("dash.totalRevenue")}</CardTitle>
              <div className="text-4xl font-bold text-white mt-2">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-sm text-emerald-400 flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" /> +{stats.revenueGrowth}% {t("dash.vsLastMonth")}
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full flex items-end justify-between gap-2 mt-4">
                {[35, 45, 30, 60, 75, 50, 65, 80, 70, 90, 85, 100].map((h, i) => (
                  <div key={i} className="w-full bg-white/10 hover:bg-vyxo-gold/80 transition-all rounded-t-md relative group" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-vyxo-navy text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      €{h}k
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-zinc-400 mt-2">
                <span>Jan</span><span>Dec</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ACTIVE CLIENTS */}
        <motion.div variants={item} className="col-span-1">
            <Card className="h-full border-l-4 border-l-vyxo-gold shadow-md hover:shadow-lg transition-all">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t("dash.activeClientsCount")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-vyxo-navy dark:text-white">{stats.activeClients}</div>
                    <p className="text-xs text-muted-foreground mt-1">{t("dash.fromSupabase")}</p>
                </CardContent>
            </Card>
        </motion.div>

        {/* PENDING AUDITS */}
        <motion.div variants={item} className="col-span-1">
            <Card className="h-full border-l-4 border-l-vyxo-navy shadow-md hover:shadow-lg transition-all">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t("dash.pendingAudits")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-vyxo-navy dark:text-white">{stats.pendingAudits}</div>
                    <p className="text-xs text-muted-foreground mt-1">{t("dash.inProgressOrReview")}</p>
                </CardContent>
            </Card>
        </motion.div>

        {/* CLIENT MAP VISUALIZATION */}
        <motion.div variants={item} className="col-span-1 md:col-span-2 lg:col-span-1 row-span-2">
             <Card className="h-full shadow-md overflow-hidden flex flex-col">
                <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
                    <CardTitle className="text-base font-medium flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-vyxo-gold" /> {t("dash.clientMap")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1 relative bg-slate-100 dark:bg-slate-950">
                    {/* Abstract Map Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <MapPin className="h-32 w-32 text-vyxo-navy" />
                    </div>
                    <div className="absolute top-1/4 left-1/4 h-3 w-3 bg-vyxo-navy rounded-full animate-ping"></div>
                    <div className="absolute top-1/4 left-1/4 h-3 w-3 bg-vyxo-navy rounded-full"></div>
                    
                    <div className="absolute top-1/2 left-1/2 h-3 w-3 bg-vyxo-gold rounded-full animate-ping delay-75"></div>
                    <div className="absolute top-1/2 left-1/2 h-3 w-3 bg-vyxo-gold rounded-full"></div>

                    <div className="absolute bottom-1/3 right-1/4 h-3 w-3 bg-vyxo-navy rounded-full animate-ping delay-150"></div>
                    <div className="absolute bottom-1/3 right-1/4 h-3 w-3 bg-vyxo-navy rounded-full"></div>
                    
                    <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                        {stats.activeClients} {t("dash.activeClientsCount")}
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        {/* RECENT ACTIVITY */}
        <motion.div variants={item} className="col-span-1 md:col-span-2 lg:col-span-1 row-span-2">
            <Card className="h-full shadow-md flex flex-col">
                <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-vyxo-navy" /> {t("dash.recentActivity")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                    <ScrollArea className="h-[300px]">
                        <div className="space-y-0">
                            {activities.length > 0 ? activities.map((act, i) => (
                                <div key={act.id} className="flex items-start p-4 border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                    <div className="h-2 w-2 mt-2 rounded-full mr-3 bg-vyxo-navy" />
                                    <div>
                                        <p className="text-sm font-medium text-vyxo-navy dark:text-white">{act.action}</p>
                                        <p className="text-xs text-muted-foreground">{act.description || act.entity_type}</p>
                                        <p className="text-[10px] text-zinc-400 mt-1">{formatTimeAgo(act.created_at)}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-4 text-center text-muted-foreground">
                                    {t("dash.noActivity")}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </motion.div>

        {/* WIN RATE */}
        <motion.div variants={item} className="col-span-1">
             <Card className="h-full border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t("dash.winRate")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-vyxo-navy dark:text-white">{stats.conversionRate}%</div>
                    <p className="text-xs text-muted-foreground mt-1">{t("dash.basedOnDeals")} {stats.totalDeals} {t("dash.deals")}</p>
                </CardContent>
            </Card>
        </motion.div>
        
      </div>
    </motion.div>
  )
}
