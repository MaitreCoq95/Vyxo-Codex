-- ═══════════════════════════════════════════════════════════════════════
-- Script: Créer Company Test + Assigner Director
-- Pour: vivienclosse@gmail.com
-- ═══════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_company_id UUID;
  v_profile_exists BOOLEAN;
BEGIN
  -- 1. Créer la company test
  INSERT INTO companies (name, sector, city, country)
  VALUES ('Vyxo Test Company', 'Technology & Training', 'Paris', 'France')
  RETURNING id INTO v_company_id;

  RAISE NOTICE '✅ Company créée avec ID: %', v_company_id;

  -- 2. Vérifier si le profile existe
  SELECT EXISTS(SELECT 1 FROM profiles WHERE email = 'vivienclosse@gmail.com')
  INTO v_profile_exists;

  IF NOT v_profile_exists THEN
    RAISE NOTICE '⚠️  Profile pas encore créé (trigger va le créer automatiquement)';
    RAISE NOTICE '⏳ Attendez quelques secondes et ré-exécutez ce script';
    RETURN;
  END IF;

  -- 3. Update le profile avec role director
  UPDATE profiles
  SET
    role = 'director',
    company_id = v_company_id,
    full_name = COALESCE(full_name, 'Vivien Closse')
  WHERE email = 'vivienclosse@gmail.com';

  RAISE NOTICE '✅ Profile mis à jour: Director de Vyxo Test Company';

  -- 4. Résumé
  RAISE NOTICE '═══════════════════════════════════════';
  RAISE NOTICE '🎉 SUCCÈS! Configuration complète:';
  RAISE NOTICE 'Company: Vyxo Test Company';
  RAISE NOTICE 'Company ID: %', v_company_id;
  RAISE NOTICE 'Director: vivienclosse@gmail.com';
  RAISE NOTICE 'Role: director';
  RAISE NOTICE '═══════════════════════════════════════';
END $$;

-- ───────────────────────────────────────────────────────────────────────
-- Vérification finale
-- ───────────────────────────────────────────────────────────────────────
SELECT
  '✅ Votre compte director' as status,
  p.email,
  p.full_name,
  p.role,
  c.name as company_name,
  c.sector,
  p.current_streak,
  p.created_at
FROM profiles p
LEFT JOIN companies c ON c.id = p.company_id
WHERE p.email = 'vivienclosse@gmail.com';
