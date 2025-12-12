'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/infrastructure/supabase/client';
import { EnhancedBentoCard } from '@/components/ui/enhanced-bento-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, FileEdit, Loader2, Image as ImageIcon, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ValidationsPage() {
  const supabase = createClient();
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  useEffect(() => {
    loadValidations();
  }, []);
  
  async function loadValidations() {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    
    // Récupérer team du manager
    const { data: team } = await supabase
      .from('teams')
      .select('id')
      .eq('manager_id', user.id)
      .single();
      
    if (!team) {
      setLoading(false);
      return;
    }
    
    // Récupérer validations en attente
    const { data: validations } = await supabase
      .from('practical_validations')
      .select(`
        *,
        user:profiles!user_id(full_name),
        module:modules!module_id(title)
      `)
      .eq('validation_status', 'pending')
      .in('user_id', (await supabase
        .from('profiles')
        .select('id')
        .eq('team_id', team.id)).data?.map((p: any) => p.id) || [])
      .order('created_at', { ascending: false });
      
    setPending(validations || []);
    setLoading(false);
  }
  
  async function approveValidation(validationId: string) {
    setProcessingId(validationId);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await supabase
      .from('practical_validations')
      .update({
        validation_status: 'approved',
        validator_id: user.id,
        validated_at: new Date().toISOString()
      })
      .eq('id', validationId);
      
    await loadValidations();
    setProcessingId(null);
  }
  
  async function rejectValidation(validationId: string) {
    setProcessingId(validationId);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await supabase
      .from('practical_validations')
      .update({
        validation_status: 'rejected',
        validator_id: user.id,
        validated_at: new Date().toISOString()
      })
      .eq('id', validationId);
      
    await loadValidations();
    setProcessingId(null);
  }
  
  async function requestRevision(validationId: string) {
    setProcessingId(validationId);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await supabase
      .from('practical_validations')
      .update({
        validation_status: 'needs_revision',
        validator_id: user.id
      })
      .eq('id', validationId);
      
    await loadValidations();
    setProcessingId(null);
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Validations Terrain</h1>
        <p className="text-muted-foreground mt-1">
          {pending.length} validation{pending.length > 1 ? 's' : ''} en attente
        </p>
      </div>

      {/* Empty State */}
      {pending.length === 0 && (
        <EnhancedBentoCard title="Aucune validation en attente" className="text-center">
          <div className="py-8">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-muted-foreground">
              Toutes les validations terrain ont été traitées
            </p>
          </div>
        </EnhancedBentoCard>
      )}

      {/* Validations List */}
      <AnimatePresence mode="popLayout">
        {pending.map((validation) => (
          <motion.div
            key={validation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            layout
          >
            <EnhancedBentoCard
              title={validation.module?.title || 'Module'}
              description={`Soumis par ${validation.user?.full_name || 'Utilisateur'} · ${new Date(validation.created_at).toLocaleDateString('fr-FR')}`}
              hover={false}
            >
              <div className="space-y-4">
                {/* File Display */}
                <div className="relative rounded-xl overflow-hidden bg-muted aspect-video flex items-center justify-center">
                  {validation.file_url ? (
                    validation.file_type?.startsWith('video') ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Video className="w-8 h-8" />
                        <span>Vidéo de validation</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <ImageIcon className="w-8 h-8" />
                        <span>Photo de validation</span>
                      </div>
                    )
                  ) : (
                    <div className="text-muted-foreground">Aucun fichier</div>
                  )}
                </div>

                {/* Notes */}
                {validation.notes && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-1">Notes :</p>
                    <p className="text-sm text-muted-foreground">{validation.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <GradientButton
                    className="flex-1"
                    size="lg"
                    onClick={() => approveValidation(validation.id)}
                    disabled={processingId === validation.id}
                    loading={processingId === validation.id}
                    variant="success"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Approuver
                  </GradientButton>
                  <GradientButton
                    className="flex-1"
                    size="lg"
                    onClick={() => rejectValidation(validation.id)}
                    disabled={processingId === validation.id}
                    loading={processingId === validation.id}
                    variant="danger"
                  >
                    <XCircle className="w-5 h-5" />
                    Rejeter
                  </GradientButton>
                  <button
                    onClick={() => requestRevision(validation.id)}
                    disabled={processingId === validation.id}
                    className={cn(
                      'px-6 py-3 border border-border rounded-[var(--radius)] font-semibold transition-all flex items-center gap-2',
                      'hover:bg-card-hover bg-card text-foreground',
                      processingId === validation.id && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {processingId === validation.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <FileEdit className="w-5 h-5" />
                    )}
                    Révision
                  </button>
                </div>
              </div>
            </EnhancedBentoCard>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
