'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/infrastructure/supabase/client';
import { EnhancedBentoCard } from '@/components/ui/enhanced-bento-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { IMOGauge } from '@/components/dashboard/IMOGauge';
import { RiskAlertsPanel } from '@/components/dashboard/RiskAlertsPanel';
import { CompetenceHeatmap } from '@/components/dashboard/CompetenceHeatmap';
import { CertificationSimulator } from '@/components/dashboard/CertificationSimulator';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  Calendar,
  Users,
  Award,
  Zap
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

export default function DirectorDashboardPage() {
  const { themeConfig } = useTheme();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Récupérer données entreprise
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (profile?.company_id) {
      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single();

      setCompany(companyData);

      // Récupérer alertes critiques
      const { data: alertsData } = await supabase
        .from('risk_alerts')
        .select('*')
        .eq('company_id', profile.company_id)
        .in('severity', ['critical', 'high'])
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

      setAlerts(alertsData || []);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Zap className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  const stats = [
    {
      title: 'ROI Formation',
      value: '87%',
      icon: TrendingUp,
      trend: { value: 12, label: 'vs mois dernier' },
      color: 'success' as const,
    },
    {
      title: 'Conformité Globale',
      value: '89%',
      icon: CheckCircle,
      trend: { value: 3, label: 'vs mois dernier' },
      color: 'success' as const,
    },
    {
      title: 'Collaborateurs à risque',
      value: alerts.length.toString(),
      icon: AlertTriangle,
      trend: { value: -2, label: 'vs mois dernier' },
      color: 'warning' as const,
    },
    {
      title: 'Taux complétion',
      value: '73%',
      icon: Target,
      trend: { value: 8, label: 'vs mois dernier' },
      color: 'primary' as const,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vue Direction</h1>
          <p className="text-muted-foreground mt-1">
            {company?.name || 'Entreprise'} · Dernière mise à jour : {new Date().toLocaleString('fr-FR')}
          </p>
        </div>
        <div className="flex gap-3">
          <GradientButton variant="primary" size="default">
            <Download className="w-4 h-4" />
            Export PDF
          </GradientButton>
          <button className="px-4 py-2 border border-border rounded-[var(--radius)] hover:bg-card-hover transition-colors flex items-center gap-2 bg-card text-foreground">
            <Calendar className="w-4 h-4" />
            Cette semaine
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* IMO + Alerts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* IMO Gauge */}
        <EnhancedBentoCard
          title="Indice Maturité Opérationnelle"
          description="Score global temps réel"
          icon={Target}
          iconColor="primary"
          gradient
        >
          <IMOGauge
            imo={{
              globalScore: company?.imo_score || 68,
              level: company?.imo_level || 'Opérationnel',
              components: {
                competences: 72,
                regularite: 81,
                pratique: 58,
                incidents: 62,
              },
              trend: 5,
              calculatedAt: new Date(),
            }}
          />
        </EnhancedBentoCard>

        {/* Risk Alerts */}
        <RiskAlertsPanel alerts={alerts} />
      </div>

      {/* Competence Heatmap */}
      <EnhancedBentoCard
        title="Matrice de Compétences"
        description="Vue temps réel des niveaux de maîtrise"
        icon={Users}
        iconColor="secondary"
        action={
          <button className="text-sm text-primary hover:underline font-medium">
            Voir complète →
          </button>
        }
      >
        <CompetenceHeatmap companyId={company?.id || ''} />
      </EnhancedBentoCard>

      {/* Certification Simulator */}
      <CertificationSimulator 
        imoScore={company?.imo_score || 68}
        companyId={company?.id || ''}
      />

      {/* Quick Actions */}
      <EnhancedBentoCard
        title="Actions Rapides"
        description="Raccourcis vers fonctionnalités clés"
        icon={Zap}
        iconColor="warning"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <GradientButton variant="primary" className="w-full">
            <Award className="w-4 h-4" />
            Badges équipe
          </GradientButton>
          <GradientButton variant="success" className="w-full">
            <CheckCircle className="w-4 h-4" />
            Validations
          </GradientButton>
          <GradientButton variant="warning" className="w-full">
            <AlertTriangle className="w-4 h-4" />
            Alertes
          </GradientButton>
          <GradientButton variant="danger" className="w-full">
            <Download className="w-4 h-4" />
            Rapports
          </GradientButton>
        </div>
      </EnhancedBentoCard>
    </div>
  );
}
