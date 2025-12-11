-- =====================================================
-- SEED DATA FOR PROSPECTING INTELLIGENCE SYSTEM
-- =====================================================

-- =====================================================
-- 1. SEED ICP SECTORS
-- =====================================================
INSERT INTO vch_icp_sectors (name, slug, description, target_company_size_min, target_company_size_max, typical_pain_points, typical_regulations, decision_makers, priority_level) VALUES
(
  'Industrie',
  'industrie',
  'PME/ETI industrielles - mécanique, plasturgie, métallurgie, sous-traitance automobile',
  50,
  500,
  ARRAY['Audits clients non passés', 'Non-conformités récurrentes', 'Documentation éclatée', 'Manque de pilotage QCDS', 'Process inefficaces'],
  ARRAY['ISO 9001', 'PPAP', 'AMDEC', 'EFQM'],
  ARRAY['Directeur Général', 'Directeur Industriel', 'Responsable Qualité', 'Responsable Production'],
  8
),
(
  'Pharma / Santé',
  'pharma-sante',
  'Laboratoires pharma, distributeurs, CMO/CDMO, MedTech',
  20,
  1000,
  ARRAY['Inspections ANSM/FDA imminentes', 'Traçabilité insuffisante', 'Validation logicielle non conforme', 'Audit trail incomplet', 'CAPA non maîtrisées'],
  ARRAY['GDP', 'BPF', 'BPD', 'ISO 13485', 'ISO 22716', 'GAMP5', '21 CFR Part 11'],
  ARRAY['Directeur Qualité', 'VP Quality', 'Responsable Affaires Réglementaires', 'QP', 'IT Manager'],
  10
),
(
  'Logistique / Transport',
  'logistique-transport',
  'Freight forwarders, 3PL, 4PL, transporteurs pharma/agroalimentaire',
  50,
  500,
  ARRAY['Non-conformité GDP', 'Ruptures chaîne du froid', 'Traçabilité insuffisante', 'Audits clients non passés', 'Process manuels'],
  ARRAY['GDP', 'Traçabilité', 'Chaîne du froid'],
  ARRAY['Directeur Général', 'Directeur Exploitation', 'Responsable Qualité', 'Responsable Logistique'],
  9
),
(
  'Agroalimentaire',
  'agroalimentaire',
  'PME agroalimentaires, fabricants cosmétiques, distributeurs produits frais',
  20,
  300,
  ARRAY['Audits IFS/BRC non passés', 'Contaminations / rappels produits', 'Traçabilité lots insuffisante', 'Chaîne du froid non maîtrisée'],
  ARRAY['HACCP', 'IFS', 'BRC', 'ISO 22716'],
  ARRAY['Directeur Général', 'Responsable Qualité', 'Responsable Production', 'Responsable R&D'],
  7
),
(
  'IT / SaaS',
  'it-saas',
  'Startups SaaS, HealthTech, FinTech, ESN, éditeurs logiciels',
  10,
  200,
  ARRAY['Exigence ISO 27001 clients', 'Conformité RGPD insuffisante', 'Validation logicielle non maîtrisée', 'Audit trail incomplet', 'Incidents sécurité récurrents'],
  ARRAY['ISO 27001', 'RGPD', 'GAMP5', '21 CFR Part 11', 'SMSI'],
  ARRAY['CTO', 'VP Engineering', 'CISO', 'DPO', 'CEO', 'VP Product'],
  10
),
(
  'Aéronautique / Défense',
  'aeronautique-defense',
  'Distributeurs pièces aéro, sous-traitants aéronautique, freight forwarders aéro',
  20,
  300,
  ARRAY['Certification AS9120B non obtenue', 'Conformité sûreté aérienne complexe', 'Traçabilité pièces critique', 'Audits clients exigeants'],
  ARRAY['AS9120B', 'CE 300/2008', 'UE 2015/1998', 'OACI Annexe 17', 'DGAC'],
  ARRAY['Directeur Général', 'Responsable Qualité Aéro', 'Responsable Sûreté', 'Directeur Supply Chain'],
  9
),
(
  'Énergie / Environnement',
  'energie-environnement',
  'Entreprises énergie, industriels chimie/pétrochimie, gestionnaires déchets',
  50,
  1000,
  ARRAY['Conformité REACH complexe', 'ISO 14001 mal pilotée', 'Gestion déchets non optimisée', 'Risques environnementaux sous-estimés'],
  ARRAY['ISO 14001', 'REACH', 'ISO 45001'],
  ARRAY['Directeur HSE', 'Directeur QHSE', 'Directeur Général', 'Responsable Environnement'],
  6
),
(
  'Supply Chain / Freight Forwarder',
  'supply-chain',
  'Freight forwarders internationaux, 3PL/4PL multi-sites, transitaires',
  100,
  2000,
  ARRAY['Process hétérogènes multi-sites', 'Manque de standardisation', 'Visibilité limitée', 'Conformité GDP partielle', 'Audits clients difficiles'],
  ARRAY['ISO 9001', 'GDP'],
  ARRAY['Directeur Général', 'COO', 'Directeur Qualité Groupe', 'Directeur Supply Chain'],
  8
),
(
  'PME Multi-sites',
  'pme-multi-sites',
  'PME/ETI 3-10 sites (France/Europe), secteurs variés',
  100,
  500,
  ARRAY['Hétérogénéité process entre sites', 'Revues de direction formelles', 'Manque de pilotage groupe', 'Audits internes inefficaces'],
  ARRAY['ISO 9001', 'ISO 45001', 'ISO 14001'],
  ARRAY['Directeur Général', 'Président', 'Directeur Qualité Groupe', 'Directeur Industriel'],
  7
);

-- =====================================================
-- 2. SEED SCORING RULES
-- =====================================================
INSERT INTO vch_scoring_rules (rule_name, rule_type, condition, points, description) VALUES
-- Sector scoring
('Pharma/IT/Aéro - Priority sectors', 'sector', '{"sectors": ["pharma-sante", "it-saas", "aeronautique-defense"]}', 20, 'Highest priority sectors'),
('Industrie/Logistique - Secondary sectors', 'sector', '{"sectors": ["industrie", "logistique-transport", "supply-chain"]}', 15, 'Secondary priority sectors'),
('Other sectors', 'sector', '{"sectors": ["agroalimentaire", "energie-environnement", "pme-multi-sites"]}', 10, 'Tertiary sectors'),

-- Pain points scoring
('3+ critical pain points', 'pain_points', '{"min_pain_points": 3}', 25, 'Multiple critical pain points identified'),
('2 critical pain points', 'pain_points', '{"min_pain_points": 2}', 20, 'Two critical pain points'),
('1 critical pain point', 'pain_points', '{"min_pain_points": 1}', 15, 'One critical pain point'),

-- Maturity scoring
('No certification', 'maturity', '{"level": "none"}', 15, 'High potential - no existing certification'),
('Poorly managed certification', 'maturity', '{"level": "low"}', 12, 'Certification exists but poorly managed'),
('Recent certification', 'maturity', '{"level": "medium"}', 8, 'Recently certified'),
('High maturity', 'maturity', '{"level": "high"}', 5, 'Mature QMS'),

-- Regulations scoring
('Critical regulations (pharma/aéro)', 'regulations', '{"critical": true}', 15, 'Critical regulatory environment'),
('Medium regulations (industrie)', 'regulations', '{"critical": false}', 10, 'Standard regulatory environment'),

-- ROI scoring
('ROI > 100k€', 'roi', '{"min_roi": 100000}', 10, 'High ROI potential'),
('ROI 50-100k€', 'roi', '{"min_roi": 50000, "max_roi": 100000}', 7, 'Medium-high ROI'),
('ROI 20-50k€', 'roi', '{"min_roi": 20000, "max_roi": 50000}', 5, 'Medium ROI'),

-- Risk scoring
('Critical risk (inspection, contract loss)', 'risk', '{"level": "critical"}', 10, 'Imminent critical risk'),
('Medium risk', 'risk', '{"level": "medium"}', 7, 'Medium-term risk'),
('Low risk', 'risk', '{"level": "low"}', 4, 'Low risk'),

-- Company size scoring
('100-500 employees (sweet spot)', 'size', '{"min": 100, "max": 500}', 5, 'Ideal company size'),
('50-100 or 500-1000 employees', 'size', '{"ranges": [[50, 100], [500, 1000]]}', 4, 'Good company size'),
('20-50 or >1000 employees', 'size', '{"ranges": [[20, 50], [1000, 10000]]}', 3, 'Acceptable company size');

-- =====================================================
-- 3. SEED EMAIL TEMPLATES (10 sectoral templates)
-- =====================================================
INSERT INTO vch_email_templates (sector_id, template_name, subject_template, body_template, pain_point_focus, tone, variables) VALUES
-- Template 1: Industrie
((SELECT id FROM vch_icp_sectors WHERE slug = 'industrie'), 
 'Audit client imminent',
 'Audit [CLIENT] dans 3 semaines — Prêt ?',
 E'Bonjour [PRÉNOM],\n\nJ''ai vu que [ENTREPRISE] travaille avec [CLIENT_EXIGEANT].\n\nLeur audit approche. Si votre SMQ n''est pas carré, ça peut coûter cher (contrat, image).\n\n15 ans dans l''industrie, j''ai vu des boîtes perdre des marchés pour des bêtises : docs manquantes, AMDEC obsolètes, 8D mal ficelés.\n\n**Proposition** : audit flash 2h de votre SMQ + plan d''action DMAIC.\nVous saurez exactement où vous en êtes.\n\nIntéressé ?\n\nVivien Closse\nVyxo Consulting',
 'Audits clients non passés',
 'direct',
 ARRAY['PRÉNOM', 'ENTREPRISE', 'CLIENT_EXIGEANT']),

-- Template 2: Pharma
((SELECT id FROM vch_icp_sectors WHERE slug = 'pharma-sante'),
 'Inspection ANSM',
 'Inspection ANSM — Êtes-vous prêt ?',
 E'Bonjour [PRÉNOM],\n\nInspection ANSM imminente chez [ENTREPRISE] ?\n\nLes points qui font échouer 80% des inspections :\n- Audit trail incomplet\n- CAPA non maîtrisées\n- Validation logicielle (GAMP5) absente\n- Traçabilité chaîne du froid approximative\n\nJ''ai accompagné 15+ labos pharma (GDP, BPF, GAMP5, 21 CFR Part 11).\n\n**Proposition** : audit express GDP/BPF + mock inspection.\nVous saurez si vous êtes prêt ou pas.\n\nÇa vous parle ?\n\nVivien Closse\nVyxo Consulting',
 'Inspections ANSM/FDA imminentes',
 'urgent',
 ARRAY['PRÉNOM', 'ENTREPRISE']),

-- Template 3: IT/SaaS
((SELECT id FROM vch_icp_sectors WHERE slug = 'it-saas'),
 'ISO 27001 exigée',
 'Deal bloqué sans ISO 27001 ?',
 E'Bonjour [PRÉNOM],\n\nVotre prospect (banque/pharma) exige ISO 27001 pour signer ?\n\nClassique. Sans certification, pas de deal.\n\nMais obtenir ISO 27001 en mode "consultant classique" = 6-12 mois + 50-100k€.\n\n**Mon approche** : roadmap pragmatique ISO 27001 en 3-6 mois.\nSMSI, analyse de risques, politiques, audits internes, sensibilisation.\n\nRésultat : certification + déblocage deals.\n\n**Proposition** : audit express ISO 27001 (2h) + roadmap.\n\nIntéressé ?\n\nVivien Closse\nVyxo Consulting',
 'Exigence ISO 27001 clients',
 'consultative',
 ARRAY['PRÉNOM']),

-- Template 4: Logistique
((SELECT id FROM vch_icp_sectors WHERE slug = 'logistique-transport'),
 'GDP manquante',
 'Clients pharma = GDP obligatoire',
 E'Bonjour [PRÉNOM],\n\n[ENTREPRISE] transporte des produits pharma ?\n\nSans agrément GDP, vous perdez ces clients.\n\nLes points bloquants GDP :\n- Traçabilité température insuffisante\n- Qualification transporteurs absente\n- Process non documentés\n- Audits internes inexistants\n\nJ''ai accompagné 10+ freight forwarders vers GDP.\n\n**Proposition** : audit GDP + plan de mise en conformité.\nVous saurez exactement ce qu''il manque.\n\nÇa vous intéresse ?\n\nVivien Closse\nVyxo Consulting',
 'Non-conformité GDP',
 'direct',
 ARRAY['PRÉNOM', 'ENTREPRISE']),

-- Template 5: Agroalimentaire
((SELECT id FROM vch_icp_sectors WHERE slug = 'agroalimentaire'),
 'Audit IFS/BRC raté',
 'Audit IFS raté = perte de référencements',
 E'Bonjour [PRÉNOM],\n\nAudit IFS/BRC raté chez [ENTREPRISE] ?\n\nConséquence : perte de référencements GMS = chute de CA.\n\nLes causes classiques :\n- HACCP obsolète\n- Traçabilité lots insuffisante\n- Chaîne du froid non maîtrisée\n- Non-conformités récurrentes\n\nJ''ai accompagné 20+ PME agroalimentaires (HACCP, IFS, BRC, ISO 22716).\n\n**Proposition** : audit HACCP/IFS + plan d''action.\nProchain audit = réussite.\n\nIntéressé ?\n\nVivien Closse\nVyxo Consulting',
 'Audits IFS/BRC non passés',
 'direct',
 ARRAY['PRÉNOM', 'ENTREPRISE']),

-- Template 6: Aéronautique
((SELECT id FROM vch_icp_sectors WHERE slug = 'aeronautique-defense'),
 'AS9120B certification',
 'AS9120B = accès marchés Airbus/Safran',
 E'Bonjour [PRÉNOM],\n\n[ENTREPRISE] veut accéder aux panels Airbus/Safran ?\n\nSans AS9120B, impossible.\n\nObtenir AS9120B = complexe :\n- Traçabilité pièces critique\n- Gestion obsolescence\n- Audits fournisseurs\n- Documentation lourde\n\nResponsable Sûreté Aérienne (DGAC), j''ai accompagné 5+ distributeurs aéro vers AS9120B.\n\n**Proposition** : audit express AS9120B + roadmap certification.\n\nÇa vous parle ?\n\nVivien Closse\nVyxo Consulting',
 'Certification AS9120B non obtenue',
 'consultative',
 ARRAY['PRÉNOM', 'ENTREPRISE']),

-- Template 7: Lean
((SELECT id FROM vch_icp_sectors WHERE slug = 'industrie'),
 'Coûts cachés Lean',
 'Vos coûts cachés = 15-25% de votre CA',
 E'Bonjour [PRÉNOM],\n\nGaspillages dans vos process = 15-25% de votre CA.\n\nSurproduction, attentes, transports inutiles, stocks, mouvements, sur-qualité, défauts.\n\n**Lean Six Sigma** = élimination systématique de ces gaspillages.\n\nJ''ai déployé Lean dans 30+ sites industriels (5S, Kanban, SMED, Kaizen, DMAIC).\n\n**Proposition** : diagnostic Lean 1 journée.\nVous verrez vos gaspillages + ROI potentiel.\n\nIntéressé ?\n\nVivien Closse\nVyxo Consulting',
 'Process inefficaces',
 'direct',
 ARRAY['PRÉNOM']),

-- Template 8: Digitalisation QMS
((SELECT id FROM vch_icp_sectors WHERE slug = 'pme-multi-sites'),
 'Digitalisation QMS',
 'Excel + SharePoint = perte de temps',
 E'Bonjour [PRÉNOM],\n\nVotre QMS = Excel + SharePoint mal utilisé ?\n\nConséquences :\n- Docs introuvables\n- Pas de visibilité (KPIs)\n- Audits = galère\n- Turnover = perte de savoir\n\n**QMS digital** (Power BI + Supabase) = dashboards temps réel, traçabilité, automatisation.\n\nJ''ai déployé 15+ QMS digitaux (industrie, pharma, logistique).\n\n**Proposition** : démo QMS digital adapté à [ENTREPRISE].\n\nÇa vous intéresse ?\n\nVivien Closse\nVyxo Consulting',
 'Documentation éclatée',
 'consultative',
 ARRAY['PRÉNOM', 'ENTREPRISE']),

-- Template 9: Multi-sites
((SELECT id FROM vch_icp_sectors WHERE slug = 'pme-multi-sites'),
 'Hétérogénéité multi-sites',
 '5 sites = 5 façons de faire ?',
 E'Bonjour [PRÉNOM],\n\n[ENTREPRISE] a plusieurs sites avec des process différents ?\n\nConséquences :\n- Inefficacités\n- Difficultés de pilotage groupe\n- Audits compliqués\n- Coûts cachés\n\n**Standardisation multi-sites** = process homogènes + dashboards groupe + audits internes.\n\nJ''ai accompagné 10+ groupes multi-sites (3-15 sites).\n\n**Proposition** : diagnostic multi-sites + plan de standardisation.\n\nIntéressé ?\n\nVivien Closse\nVyxo Consulting',
 'Hétérogénéité process entre sites',
 'direct',
 ARRAY['PRÉNOM', 'ENTREPRISE']),

-- Template 10: Externalisation
((SELECT id FROM vch_icp_sectors WHERE slug = 'industrie'),
 'Externalisation QHSE',
 'Responsable Qualité parti = trou dans la raquette ?',
 E'Bonjour [PRÉNOM],\n\nVotre Responsable Qualité est parti ?\n\nRecrutement = 3-6 mois + risque de mauvais choix.\n\n**Solution** : externalisation QHSE temporaire ou permanente.\n\nJe prends en charge :\n- Audits internes\n- Revues de direction\n- Gestion documentaire\n- Pilotage KPIs\n- Formations\n\nVous gardez la conformité sans recruter.\n\n**Proposition** : échange 15 min sur vos besoins.\n\nIntéressé ?\n\nVivien Closse\nVyxo Consulting',
 'Turnover qualité',
 'consultative',
 ARRAY['PRÉNOM']);
