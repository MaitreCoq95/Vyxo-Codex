'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { createClient } from '@/infrastructure/supabase/client';
import { GradientButton } from '@/components/ui/gradient-button';
import { Progress } from '@/components/ui/progress';
import { Flame, Clock, Award, ArrowLeft, Zap } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

export default function DailyChallengePage() {
  const router = useRouter();
  const { themeConfig } = useTheme();
  const supabase = createClient();
  
  const [challenge, setChallenge] = useState<any>(null);
  const [userStreak, setUserStreak] = useState(0);
  const [userLevel, setUserLevel] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenge();
  }, []);

  useEffect(() => {
    if (!showFeedback && challenge) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showFeedback, challenge]);

  async function loadChallenge() {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // Récupérer challenge du jour
    const today = new Date().toISOString().split('T')[0];
    const { data: challengeData } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('user_id', user.id)
      .eq('scheduled_for', today)
      .single();

    // Récupérer streak et niveau
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_streak, level')
      .eq('id', user.id)
      .single();

    if (challengeData) {
      setChallenge(challengeData);
    }
    
    if (profile) {
      setUserStreak(profile.current_streak || 0);
      setUserLevel(profile.level || 0);
    }

    setLoading(false);
  }

  const handleSubmit = async () => {
    if (selectedAnswer === null || !challenge) return;

    const isCorrect = challenge.content.options[selectedAnswer].correct;
    
    if (isCorrect) {
      // Confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06B6D4', '#6366F1', '#10B981']
      });
      
      // Update progress via API
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Mark challenge as completed
        await supabase
          .from('daily_challenges')
          .update({ 
            completed: true,
            completed_at: new Date().toISOString(),
            score: 100
          })
          .eq('id', challenge.id);

        // Update streak
        await supabase.rpc('update_user_streak', { user_id: user.id });
        
        // Reload data
        await loadChallenge();
      }
    }
    
    setShowFeedback(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Zap className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-foreground">Chargement du défi...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Défi complété !
          </h2>
          <p className="text-muted-foreground mb-6">
            Revenez demain pour un nouveau challenge
          </p>
          <GradientButton onClick={() => router.push('/dashboard')} variant="primary">
            Retour au dashboard
          </GradientButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.back()} 
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <h1 className="text-xl font-bold text-foreground">🎯 Défi du jour</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-warning/10 text-warning px-3 py-1.5 rounded-full">
                <Flame className="w-4 h-4" />
                <span className="font-bold">{userStreak} jours</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm">{formatTime(timeElapsed)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          {!showFeedback ? (
            // Question View
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Image Placeholder */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-muted">
                <div className="w-full aspect-[4/3] flex items-center justify-center">
                  <div className="text-6xl">{challenge.content.type === 'photo_interactive' ? '📸' : '🎯'}</div>
                </div>
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Award className="w-4 h-4 text-warning" />
                  +{challenge.content.points || 10} pts
                </div>
              </div>

              {/* Question */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <p className="text-xl font-bold text-foreground mb-1">
                  {challenge.content.question}
                </p>
                <p className="text-sm text-muted-foreground">
                  {challenge.content.teaser}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {challenge.content.options.map((option: any, index: number) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedAnswer(index)}
                    className={cn(
                      'w-full text-left p-5 rounded-xl border-2 transition-all duration-200',
                      selectedAnswer === index
                        ? `border-primary bg-gradient-to-r ${themeConfig.gradients.primary} text-white shadow-lg`
                        : 'border-border bg-card hover:border-primary/50 hover:bg-card-hover'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                        selectedAnswer === index
                          ? 'border-white bg-white/20'
                          : 'border-border'
                      )}>
                        {selectedAnswer === index && (
                          <div className="w-3 h-3 rounded-full bg-white" />
                        )}
                      </div>
                      <span className={cn(
                        'font-medium',
                        selectedAnswer === index ? 'text-white' : 'text-foreground'
                      )}>
                        {option.text}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Submit */}
              <GradientButton
                size="lg"
                fullWidth
                disabled={selectedAnswer === null}
                onClick={handleSubmit}
                variant="success"
              >
                VALIDER MA RÉPONSE
              </GradientButton>

              {/* Footer info */}
              <div className="text-center text-sm text-muted-foreground">
                ⏱️ Temps moyen : 2min 30s · 🎯 Taux de réussite : 73%
              </div>
            </motion.div>
          ) : (
            // Feedback View
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Result Card */}
              <div className={cn(
                'rounded-2xl p-8 text-center shadow-xl',
                challenge.content.options[selectedAnswer!].correct
                  ? `bg-gradient-to-br ${themeConfig.gradients.success}`
                  : `bg-gradient-to-br ${themeConfig.gradients.warning}`
              )}>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="text-6xl mb-4"
                >
                  {challenge.content.options[selectedAnswer!].correct ? '✅' : '💡'}
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  {challenge.content.options[selectedAnswer!].correct ? 'BIEN VU !' : 'PAS TOUT À FAIT'}
                </h2>
                <p className="text-lg text-white/90 mb-6">
                  {challenge.content.options[selectedAnswer!].explanation}
                </p>

                {challenge.content.options[selectedAnswer!].correct && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-center gap-2 text-white">
                      <Award className="w-5 h-5" />
                      <span className="font-bold text-xl">+{challenge.content.points || 10} points</span>
                    </div>
                    <Progress value={(userLevel / 100) * 100} className="h-2" />
                    <p className="text-sm text-white/80">
                      Niveau : {userLevel}%
                    </p>
                    <div className="flex items-center justify-center gap-2 text-white mt-3">
                      <Flame className="w-5 h-5" />
                      <span className="font-bold">Série maintenue : {userStreak + 1} jours 🔥</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <GradientButton
                  size="lg"
                  fullWidth
                  onClick={() => router.push('/dashboard')}
                  variant="primary"
                >
                  CONTINUER →
                </GradientButton>
                
                {!challenge.content.options[selectedAnswer!].correct && (
                  <button
                    onClick={() => {
                      setSelectedAnswer(null);
                      setShowFeedback(false);
                      setTimeElapsed(0);
                    }}
                    className="w-full py-3 text-primary font-medium hover:underline"
                  >
                    Réessayer
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
