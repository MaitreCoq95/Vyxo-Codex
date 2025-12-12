'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import { EnhancedBentoCard } from '@/components/ui/enhanced-bento-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { 
  BookOpen, 
  Target, 
  Award, 
  TrendingUp, 
  Zap,
  Users,
  CheckCircle,
  Flame,
  Trophy,
  BarChart3
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { themeConfig } = useTheme();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    modules: 15,
    completion: 85,
    streak: 12,
    xp: 2450
  });

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      setUser(profile);
      
      if (profile) {
        setStats(prev => ({
          ...prev,
          streak: profile.current_streak || 0
        }));
      }
    }
  }

  const quickActions = [
    {
      title: 'Défi du jour',
      description: 'Challenge quotidien personnalisé',
      icon: Zap,
      color: 'warning' as const,
      route: '/challenge',
      gradient: true
    },
    {
      title: 'Modules',
      description: '15 modules disponibles',
      icon: BookOpen,
      color: 'primary' as const,
      route: '/codex/modules',
      gradient: false
    },
    {
      title: 'Parcours',
      description: '12 parcours d\'apprentissage',
      icon: Target,
      color: 'secondary' as const,
      route: '/codex/learning',
      gradient: false
    },
    {
      title: 'Mes Badges',
      description: 'Voir mes accomplissements',
      icon: Award,
      color: 'success' as const,
      route: '/codex/badges',
      gradient: false
    }
  ];

  const managerActions = [
    {
      title: 'Vyxo Flash',
      description: 'Briefing quotidien équipe',
      icon: Zap,
      route: '/manager/vyxo-flash'
    },
    {
      title: 'Validations',
      description: 'Validations terrain en attente',
      icon: CheckCircle,
      route: '/manager/validations'
    }
  ];

  const directorActions = [
    {
      title: 'Dashboard Direction',
      description: 'Vue globale IMO & KPIs',
      icon: BarChart3,
      route: '/director'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                📚 Vyxo Codex
              </h1>
              <p className="text-muted-foreground">
                Votre base de connaissances pour maîtriser les normes ISO, GDP, GMP, CEIV
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <GradientButton 
                variant="primary" 
                size="default"
                onClick={() => router.push('/codex/search')}
              >
                🔍 Rechercher
              </GradientButton>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className={cn(
          'relative rounded-2xl overflow-hidden p-8 text-white',
          `bg-gradient-to-br ${themeConfig.gradients.hero}`
        )}>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-2">
              Bonjour {user?.full_name || 'Utilisateur'} ! 👋
            </h2>
            <p className="text-xl opacity-90 mb-6">
              Continuez votre progression et atteignez l'excellence opérationnelle
            </p>
            <div className="flex gap-4">
              <GradientButton 
                variant="warning" 
                size="lg"
                onClick={() => router.push('/challenge')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
              >
                <Zap className="w-5 h-5" />
                Défi du jour
              </GradientButton>
              <button 
                onClick={() => router.push('/codex/learning')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 font-semibold transition-all"
              >
                Continuer ma formation →
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <Trophy className="w-full h-full" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Modules actifs"
            value={stats.modules.toString()}
            icon={BookOpen}
            color="primary"
            trend={{ value: 3, label: 'ce mois' }}
          />
          <StatsCard
            title="Taux de complétion"
            value={`${stats.completion}%`}
            icon={TrendingUp}
            color="success"
            trend={{ value: 12, label: 'vs mois dernier' }}
          />
          <StatsCard
            title="Série en cours"
            value={`${stats.streak} jours`}
            icon={Flame}
            color="warning"
          />
          <StatsCard
            title="Points XP"
            value={stats.xp.toString()}
            icon={Trophy}
            color="primary"
            trend={{ value: 250, label: 'cette semaine' }}
          />
        </div>

        {/* Quick Actions */}
        <EnhancedBentoCard
          title="Actions Rapides"
          description="Accès direct aux fonctionnalités principales"
          icon={Zap}
          iconColor="warning"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => router.push(action.route)}
                className={cn(
                  'p-6 rounded-xl border border-border transition-all',
                  'hover:scale-105 hover:shadow-lg',
                  'bg-card hover:bg-card-hover',
                  action.gradient && `bg-gradient-to-br ${themeConfig.gradients[action.color]}`
                )}
              >
                <action.icon className={cn(
                  'w-8 h-8 mb-3',
                  action.gradient ? 'text-white' : `text-${action.color}`
                )} />
                <h3 className={cn(
                  'font-bold mb-1',
                  action.gradient ? 'text-white' : 'text-foreground'
                )}>
                  {action.title}
                </h3>
                <p className={cn(
                  'text-sm',
                  action.gradient ? 'text-white/80' : 'text-muted-foreground'
                )}>
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </EnhancedBentoCard>

        {/* Manager Section */}
        {user?.role === 'manager' && (
          <EnhancedBentoCard
            title="Espace Manager"
            description="Gestion d'équipe et validations"
            icon={Users}
            iconColor="secondary"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {managerActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => router.push(action.route)}
                  className="p-6 rounded-xl border border-border bg-card hover:bg-card-hover transition-all hover:scale-105"
                >
                  <action.icon className="w-8 h-8 mb-3 text-secondary" />
                  <h3 className="font-bold mb-1 text-foreground">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </button>
              ))}
            </div>
          </EnhancedBentoCard>
        )}

        {/* Director Section */}
        {user?.role === 'director' && (
          <EnhancedBentoCard
            title="Espace Direction"
            description="Vue stratégique et décisionnelle"
            icon={BarChart3}
            iconColor="primary"
          >
            <div className="grid gap-4">
              {directorActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => router.push(action.route)}
                  className="p-6 rounded-xl border border-border bg-card hover:bg-card-hover transition-all hover:scale-105"
                >
                  <action.icon className="w-8 h-8 mb-3 text-primary" />
                  <h3 className="font-bold mb-1 text-foreground">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </button>
              ))}
            </div>
          </EnhancedBentoCard>
        )}
      </div>
    </div>
  );
}
