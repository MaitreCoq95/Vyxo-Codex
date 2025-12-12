-- ═══════════════════════════════════════════════════════════════════════
-- VYXO CODEX 2.0 - SYSTÈME DE NOTIFICATIONS COMPLET
-- Tables: notifications, push_subscriptions
-- Channels: In-App, Email, Web Push
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────
-- 1. TABLE NOTIFICATIONS (In-App)
-- ───────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'streak_milestone',
    'streak_risk',
    'badge_awarded',
    'vyxo_flash_ready',
    'challenge_assigned',
    'duel_challenge',
    'validation_required',
    'incident_created'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  action_url TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_priority ON notifications(priority) WHERE read = false;

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();

-- RLS Policies pour notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs voient seulement leurs notifications
CREATE POLICY "Users view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leurs notifications (marquer comme lu)
CREATE POLICY "Users update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Seul le système peut créer des notifications (service role uniquement)
-- Pas de policy INSERT = seul service_role peut insérer

-- ───────────────────────────────────────────────────────────────────────
-- 2. TABLE PUSH SUBSCRIPTIONS (Web Push)
-- ───────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  keys JSONB NOT NULL, -- { p256dh: string, auth: string }
  user_agent TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_push_subscriptions_user_active ON push_subscriptions(user_id, active);
CREATE INDEX idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- RLS Policies pour push_subscriptions
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs voient leurs propres subscriptions
CREATE POLICY "Users view own subscriptions" ON push_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs subscriptions
CREATE POLICY "Users create own subscriptions" ON push_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leurs subscriptions
CREATE POLICY "Users update own subscriptions" ON push_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs subscriptions
CREATE POLICY "Users delete own subscriptions" ON push_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- ───────────────────────────────────────────────────────────────────────
-- 3. AJOUT CHAMP EMAIL AUX PROFILES (si manquant)
-- ───────────────────────────────────────────────────────────────────────

-- Vérifier si la colonne email existe déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email TEXT;

    -- Créer un trigger pour synchroniser l'email depuis auth.users
    CREATE OR REPLACE FUNCTION sync_profile_email()
    RETURNS TRIGGER AS $func$
    BEGIN
      UPDATE profiles
      SET email = NEW.email
      WHERE id = NEW.id;
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;

    CREATE TRIGGER trigger_sync_profile_email
      AFTER UPDATE OF email ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION sync_profile_email();

    -- Remplir les emails existants
    UPDATE profiles p
    SET email = u.email
    FROM auth.users u
    WHERE p.id = u.id AND p.email IS NULL;
  END IF;
END $$;

-- ───────────────────────────────────────────────────────────────────────
-- 4. FONCTIONS UTILITAIRES
-- ───────────────────────────────────────────────────────────────────────

-- Fonction pour obtenir le compteur de notifications non lues
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM notifications
    WHERE user_id = p_user_id AND read = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour marquer toutes les notifications comme lues
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE notifications
  SET read = true, read_at = now()
  WHERE user_id = p_user_id AND read = false;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour nettoyer les anciennes notifications (30+ jours)
CREATE OR REPLACE FUNCTION clean_old_notifications()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  DELETE FROM notifications
  WHERE read = true
  AND created_at < now() - INTERVAL '30 days';

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ───────────────────────────────────────────────────────────────────────
-- 5. NOTIFICATION PREFERENCES (optionnel)
-- ───────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Canaux activés par type de notification
  streak_milestone_channels TEXT[] DEFAULT ARRAY['in_app'],
  streak_risk_channels TEXT[] DEFAULT ARRAY['in_app', 'push'],
  badge_awarded_channels TEXT[] DEFAULT ARRAY['in_app', 'email'],
  vyxo_flash_ready_channels TEXT[] DEFAULT ARRAY['in_app', 'push'],
  challenge_assigned_channels TEXT[] DEFAULT ARRAY['in_app'],
  duel_challenge_channels TEXT[] DEFAULT ARRAY['in_app', 'push'],
  validation_required_channels TEXT[] DEFAULT ARRAY['in_app', 'push'],
  incident_created_channels TEXT[] DEFAULT ARRAY['in_app'],

  -- Paramètres globaux
  do_not_disturb_start TIME,
  do_not_disturb_end TIME,
  timezone TEXT DEFAULT 'Europe/Paris',

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS pour notification_preferences
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own preferences" ON notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Créer préférences par défaut pour nouveaux utilisateurs
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_notification_preferences
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_preferences();

-- ───────────────────────────────────────────────────────────────────────
-- 6. VUES UTILES
-- ───────────────────────────────────────────────────────────────────────

-- Vue pour les notifications récentes avec infos utilisateur
CREATE OR REPLACE VIEW v_notifications_enriched AS
SELECT
  n.*,
  p.full_name,
  p.role,
  p.company_id
FROM notifications n
JOIN profiles p ON n.user_id = p.id
ORDER BY n.created_at DESC;

-- Vue pour les stats de notifications par utilisateur
CREATE OR REPLACE VIEW v_notification_stats AS
SELECT
  user_id,
  COUNT(*) as total_notifications,
  COUNT(*) FILTER (WHERE read = false) as unread_count,
  COUNT(*) FILTER (WHERE priority = 'urgent') as urgent_count,
  MAX(created_at) as last_notification_at
FROM notifications
GROUP BY user_id;

-- ───────────────────────────────────────────────────────────────────────
-- 7. SEED DATA - Types de notifications (documentation)
-- ───────────────────────────────────────────────────────────────────────

COMMENT ON TABLE notifications IS 'Notifications in-app pour les utilisateurs. Types disponibles: streak_milestone, streak_risk, badge_awarded, vyxo_flash_ready, challenge_assigned, duel_challenge, validation_required, incident_created';

COMMENT ON TABLE push_subscriptions IS 'Subscriptions Web Push pour notifications navigateur';

COMMENT ON TABLE notification_preferences IS 'Préférences de notifications par utilisateur (canaux, horaires DND)';
