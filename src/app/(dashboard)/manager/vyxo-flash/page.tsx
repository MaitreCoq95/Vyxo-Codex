'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/infrastructure/supabase/client';
import { EnhancedBentoCard } from '@/components/ui/enhanced-bento-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Zap, Users, Phone, FileText, CheckCircle2, Calendar, Clock, Loader2 } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function VyxoFlashPage() {
  const { themeConfig } = useTheme();
  const supabase = createClient();
  
  const [flash, setFlash] = useState<any>(null);
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Récupérer team du manager
    const { data: teamData } = await supabase
      .from('teams')
      .select('id, name')
      .eq('manager_id', user.id)
      .single();
      
    if (!teamData) {
      setLoading(false);
      return;
    }
    
    setTeam(teamData);
    
    // Récupérer flash du jour
    const today = new Date().toISOString().split('T')[0];
    const { data: flashData } = await supabase
      .from('vyxo_flashes')
      .select('*')
      .eq('team_id', teamData.id)
      .eq('date', today)
      .single();
      
    if (flashData) {
      setFlash(flashData);
      setCompleted(flashData.completed || false);
    }

    setLoading(false);
  }

  async function handleMarkCompleted() {
    if (!flash) return;
    
    setProcessing(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await supabase
      .from('vyxo_flashes')
      .update({
        completed: true,
        completed_by: user.id,
        completed_at: new Date().toISOString()
      })
      .eq('id', flash.id);
      
    setCompleted(true);
    setProcessing(false);
  }

  async function handlePostpone() {
    if (!flash) return;
    
    setProcessing(true);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    await supabase
      .from('vyxo_flashes')
      .update({
        date: tomorrow.toISOString().split('T')[0]
      })
      .eq('id', flash.id);
      
    await loadData();
    setProcessing(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <EnhancedBentoCard title="Aucune équipe assignée" className="max-w-md">
          <p className="text-muted-foreground">
            Contactez votre administrateur pour être assigné à une équipe.
          </p>
        </EnhancedBentoCard>
      </div>
    );
  }

  if (!flash) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <EnhancedBentoCard title="Aucun flash aujourd'hui" className="max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-muted-foreground">
            Votre équipe maintient un bon niveau. Continuez comme ça !
          </p>
        </EnhancedBentoCard>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">⚡ Vyxo Flash</h1>
        <p className="text-muted-foreground">
          Briefing quotidien généré par IA · {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Main Flash Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'relative rounded-2xl overflow-hidden shadow-2xl mb-8',
          `bg-gradient-to-br ${themeConfig.gradients.warning}`,
          'p-8 text-white'
        )}
      >
        {/* Icon */}
        <div className="absolute top-6 right-6 opacity-20">
          <Zap className="w-32 h-32" />
        </div>

        {/* Content */}
        <div className="relative space-y-6">
          {/* Title */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">ALERTE ÉQUIPE</span>
            </div>
            <h2 className="text-4xl font-bold mb-2">{flash.titre}</h2>
            <h3 className="text-2xl font-semibold opacity-90">{flash.hook}</h3>
          </div>

          {/* Context */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <p className="text-lg leading-relaxed">{flash.contexte}</p>
            </div>
          </div>

          {/* Exercise */}
          <div className="space-y-3">
            <h4 className="text-xl font-bold flex items-center gap-2">
              <span>🎯</span>
              {flash.exercice_pratique?.temps_estime || '2 min'} - Exercice pratique
            </h4>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <p className="font-medium mb-3">{flash.exercice_pratique?.description}</p>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="italic">💬 &quot;{flash.exercice_pratique?.question}&quot;</p>
              </div>
            </div>
          </div>

          {/* Key Points */}
          {flash.exercice_pratique?.points_cles && (
            <div className="space-y-3">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <span>💬</span>
                Points clés à rappeler :
              </h4>
              <div className="grid gap-2">
                {flash.exercice_pratique.points_cles.map((point: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Message */}
          <div className="bg-warning-300/20 backdrop-blur-sm rounded-xl p-6 border-2 border-warning-300/30">
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">💡</span>
              <p className="text-2xl font-bold text-center">
                {flash.message_cle}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <GradientButton
              size="lg"
              fullWidth
              variant="success"
              onClick={handleMarkCompleted}
              disabled={completed || processing}
              loading={processing}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            >
              {completed ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  BRIEFING EFFECTUÉ
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  MARQUER COMME EFFECTUÉ
                </>
              )}
            </GradientButton>
            <button 
              onClick={handlePostpone}
              disabled={processing}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 font-semibold transition-all flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              REPORTER
            </button>
          </div>
        </div>
      </motion.div>

      {/* Affected Users */}
      {flash.affected_users && flash.affected_users.length > 0 && (
        <EnhancedBentoCard
          title="Collaborateurs concernés"
          description={`${flash.affected_users.length} personne${flash.affected_users.length > 1 ? 's' : ''} à suivre`}
          icon={Users}
          iconColor="secondary"
          className="mb-8"
        >
          <div className="text-sm text-muted-foreground">
            Liste des collaborateurs concernés par ce sujet
          </div>
        </EnhancedBentoCard>
      )}

      {/* History Preview */}
      <EnhancedBentoCard
        title="Historique des flashes"
        description="7 derniers jours"
        icon={Clock}
        iconColor="primary"
        action={
          <button className="text-sm text-primary hover:underline font-medium">
            Voir tout →
          </button>
        }
      >
        <div className="text-sm text-muted-foreground">
          Briefings récents de votre équipe
        </div>
      </EnhancedBentoCard>
    </div>
  );
}
