-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Table: vch_codir_members
create table if not exists vch_codir_members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null,
  mission text,
  long_bio text,
  portfolio_url text,
  quote text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Table: vch_codir_competencies
create table if not exists vch_codir_competencies (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references vch_codir_members(id) on delete cascade,
  category text not null, -- finance, operations, etc.
  label text not null,
  description text,
  level text default 'Expert',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Table: vch_codir_impacts
-- Stores lists of strengths, impact zones, and results.
-- Since the inputs are separate lists, we'll store them as rows where other fields might be null,
-- OR we map them if they relate. Given the data, they seem independent.
-- We will use this table to store all 3 types of "impact" data.
create table if not exists vch_codir_impacts (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references vch_codir_members(id) on delete cascade,
  type text not null, -- 'strength', 'impact_zone', 'result'
  content text not null,
  created_at timestamptz default now()
);

-- SEED DATA

do $$
declare
  v_vivien_id uuid := 'd0b5e8a0-5c1a-4d1e-8e5a-1b2c3d4e5f6a';
  v_nicolas_id uuid := 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d';
  v_wyssam_id uuid := 'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e';
  v_rafael_id uuid := 'c3d4e5f6-a1b2-4c3d-0e4f-5a6b7c8d9e0f';
  v_aurore_id uuid := 'd4e5f6a1-b2c3-4d4e-1f5a-6b7c8d9e0f1a';
begin

  -- Clean up existing data to avoid duplicates if re-run (optional, or rely on empty DB)
  delete from vch_codir_members where id in (v_vivien_id, v_nicolas_id, v_wyssam_id, v_rafael_id, v_aurore_id);

  -- 1. VIVIEN CLOSSE
  insert into vch_codir_members (id, name, role, mission, long_bio, portfolio_url, quote)
  values (
    v_vivien_id,
    'Vivien Closse',
    'Fondateur & CEO | Consultant QSE & Excellence Opérationnelle | Architecte Systèmes & IA',
    'Structurer et déployer l’écosystème Vyxo (Vyxo Consulting, Vyxo Generator, Vyxo Central Hub, Bartop Brothers, MO×2…), en combinant : QSE, normes, excellence opérationnelle, IA, et automatisation. Concevoir des offres et des systèmes qui transforment la conformité et la qualité en levier de performance et de différenciation.',
    'Vivien est le fondateur de Vyxo. Il vient du terrain qualité / QHSE / transport sensible et a progressivement bâti un positionnement hybride : consultant QSE & excellence opérationnelle, architecte d’écosystèmes IA, et créateur de solutions sur mesure (consulting + SaaS + automatisation). Il travaille sur des sujets comme la chaîne du froid, la GDP, la sûreté aéroportuaire, les systèmes de management ISO, et la transformation digitale (bots, intégrations, hubs). Sa spécificité est de connecter des mondes qui ne se parlent pas : normes & opérations, IA & terrain, créativité & rigueur système.',
    '',
    '"La vision ne vaut rien si elle ne descend pas jusqu’au terrain."'
  );

  -- Competencies (Vivien)
  insert into vch_codir_competencies (member_id, category, label, description, level) values
  (v_vivien_id, 'finance', 'Modèles éco & SaaS', 'Structuration de modèles économiques pour offres de conseil & SaaS', 'Expert'),
  (v_vivien_id, 'finance', 'Contrôle de gestion performance', 'Notions de contrôle de gestion orienté performance terrain', 'Avancé'),
  (v_vivien_id, 'finance', 'Offres ROI', 'Construction d’offres à ROI mesurable (consulting + produits)', 'Expert'),
  
  (v_vivien_id, 'operations', 'Audits terrain QHSE/Log/Transport', 'Audits terrain QHSE, logistique, transport sensible', 'Expert'),
  (v_vivien_id, 'operations', 'Analyse de flux', 'Analyse de flux, identification des points de rupture (process & qualité)', 'Expert'),
  (v_vivien_id, 'operations', 'Actions CAPA', 'Mise en place d’actions correctives et préventives opérationnelles', 'Expert'),
  (v_vivien_id, 'operations', 'Pilotage multi-piliers', 'Pilotage de projets multi-piliers (Finance, Ops, Qualité, Produit)', 'Expert'),

  (v_vivien_id, 'quality', 'Culture QHSE', 'Culture QHSE globale', 'Expert'),
  (v_vivien_id, 'quality', 'SMI ISO 9001/14001/45001', 'Systèmes de management intégrés (ISO 9001, 14001, 45001… en cours de spécialisation)', 'Avancé'),
  (v_vivien_id, 'quality', 'Approche risques', 'Approche par les risques, non-conformités, plan d’action', 'Expert'),
  (v_vivien_id, 'quality', 'Référentiels & Audit', 'Construction de référentiels qualité et check-lists d’audit', 'Expert'),

  (v_vivien_id, 'norms', 'ISO 9001, 14001, 45001', 'Normes et référentiels : ISO 9001, ISO 14001, ISO 45001', 'Avancé'),
  (v_vivien_id, 'norms', 'Normes Santé/Pharma/Data', 'Spécialisation : GDP, BPD/BPF, HACCP, ISO 13485, ISO 14971, ISO 27001', 'Avancé'),
  (v_vivien_id, 'norms', 'Sûreté Aéroportuaire', 'Modules 11.2.2, 11.2.3.9, 11.2.6.2, 11.2.3.10, 11.2.5', 'Expert'),
  
  (v_vivien_id, 'tech', 'Architectures Hybrides', 'Conception d’architectures hybrides (Supabase, Vercel, bots Telegram, API)', 'Avancé'),
  (v_vivien_id, 'tech', 'Outils Génératifs', 'Utilisation des IA (ChatGPT, Claude, outils génératifs)', 'Expert'),
  (v_vivien_id, 'tech', 'Structuration Hubs', 'Structuration de hubs (Vyxo Central Hub, UNIQ, systèmes de knowledge)', 'Expert'),

  (v_vivien_id, 'dataIa', 'IA dans le métier', 'Vision “IA dans le métier” : injecter l’IA dans QSE, GDP, audits', 'Expert'),
  (v_vivien_id, 'dataIa', 'Workflows IA', 'Design de workflows : audit → data → IA → décisions', 'Avancé'),
  (v_vivien_id, 'dataIa', 'IA Copilote', 'Utilisation de l’IA comme copilote pour documentation, audit flash, checklists', 'Expert'),

  (v_vivien_id, 'methods', 'Approche Écosystème', 'Vision → Architecture → Prototypes → Industrialisation', 'Expert'),
  (v_vivien_id, 'methods', 'Pensée Système', 'Pensée système entre plusieurs projets (consulting, SaaS, hardware)', 'Expert'),
  (v_vivien_id, 'methods', 'Méthodes QSE & Produit', 'Méthodes QSE (PDCA, risques) combinées à l’itération produit', 'Expert'),

  (v_vivien_id, 'softSkills', 'Vision Long Terme', 'Vision long terme', 'Expert'),
  (v_vivien_id, 'softSkills', 'Idéation', 'Capacité à générer des idées et des offres', 'Expert'),
  (v_vivien_id, 'softSkills', 'Interconnexion', 'Capacité à connecter les expertises des autres membres du Codir', 'Expert'),
  (v_vivien_id, 'softSkills', 'Leadership Créatif', 'Leadership créatif et “multi-casquette” assumée', 'Expert');

  -- Impacts (Vivien)
  insert into vch_codir_impacts (member_id, type, content) values
  (v_vivien_id, 'strength', 'Création de solutions originales à la croisée des normes, du terrain et de l’IA'),
  (v_vivien_id, 'strength', 'Capacité à assembler une équipe de très hauts profils autour d’une vision'),
  (v_vivien_id, 'strength', 'Compréhension globale des enjeux QSE, logistique, IA, business'),
  (v_vivien_id, 'impact_zone', 'Design d’offres et de produits Vyxo'),
  (v_vivien_id, 'impact_zone', 'Structuration globale des systèmes (Vyxo Central Hub, UNIQ, etc.)'),
  (v_vivien_id, 'impact_zone', 'Direction stratégique des missions complexes et multi-pays / multi-pôles'),
  (v_vivien_id, 'result', 'Création d’un écosystème Vyxo multi-projets (consulting, SaaS, hardware, IA)'),
  (v_vivien_id, 'result', 'Mise en place d’une architecture IA et outils (bots, hubs, automatisation) pour accélérer la production');


  -- 2. NICOLAS LEMOINE
  insert into vch_codir_members (id, name, role, mission, long_bio, portfolio_url, quote)
  values (
    v_nicolas_id,
    'Nicolas Lemoine',
    'Chief Performance & Finance Strategist | Fondateur Vyxo Consulting',
    'Transformer les données financières en leviers de performance mesurable en combinant Finance, Data, IA et Excellence Opérationnelle. Faire passer les directions financières d’un pilotage subi (Excel manuel) à un pilotage automatisé, fiable et orienté ROI.',
    'Nicolas a plus de 10 ans d’expérience en pilotage financier multi-pays (France, Belgique, Allemagne). Il a occupé des postes de Financial Controller chez Atradius (France / Benelux / Allemagne), Analyste Financier chez Barclays, et Contrôleur de Gestion chez LBMG Worklabs. Il est spécialisé en contrôle de gestion, budgeting, forecasting, cost control, analyse de variance et consolidation multi-pays. Il combine cette expertise financière avec une très forte dimension Data / BI (Power BI, Excel avancé, SQL) et IA (chatbots internes, automatisation de reporting, modélisation prédictive).',
    'https://vyxo-portfolio-nicolas-lemoine.vercel.app/',
    '"Chaque donnée financière doit prouver sa valeur, sinon elle est inutile."'
  );

  -- Competencies (Nicolas)
  insert into vch_codir_competencies (member_id, category, label, description, level) values
  (v_nicolas_id, 'finance', 'Contrôle de Gestion', 'Contrôle de gestion complet', 'Expert'),
  (v_nicolas_id, 'finance', 'Budgeting & Forecasting', 'Budgeting & Forecasting (including rolling forecast)', 'Expert'),
  (v_nicolas_id, 'finance', 'Cost Control', 'Cost control & analyse de marge', 'Expert'),
  (v_nicolas_id, 'finance', 'Variance Analysis', 'Analyse de variance (prix, volume, mix)', 'Expert'),
  (v_nicolas_id, 'finance', 'Consolidation', 'Consolidation multi-pays', 'Expert'),

  (v_nicolas_id, 'dataIa', 'Power BI', 'Power BI (expert)', 'Expert'),
  (v_nicolas_id, 'dataIa', 'Excel Avancé', 'Excel avancé (Power Pivot, Power Query, DAX)', 'Expert'),
  (v_nicolas_id, 'dataIa', 'SQL', 'SQL pour extraction, transformation, modélisation', 'Avancé'),
  (v_nicolas_id, 'dataIa', 'Python & R', 'Python & R pour analyses avancées et modèles prédictifs', 'Avancé'),
  (v_nicolas_id, 'dataIa', 'Chatbots IA Finance', 'Création de chatbots IA internes pour la finance', 'Avancé'),
  (v_nicolas_id, 'dataIa', 'Auto-Reporting', 'Automatisation complète de reporting financier', 'Expert'),
  (v_nicolas_id, 'dataIa', 'Modélisation Prédictive', 'Modélisation prédictive (marge, cash burn, scénarios de risque)', 'Avancé'),

  (v_nicolas_id, 'norms', 'ISO 8000', 'ISO 8000 (Data Quality)', 'Expert'),
  (v_nicolas_id, 'norms', 'ISO 27001', 'ISO 27001 (Sécurité de l’information)', 'Avancé'),
  (v_nicolas_id, 'norms', 'Certification DFCG', 'Certification DFCG (référence en finance d’entreprise)', 'Expert'),

  (v_nicolas_id, 'methods', 'Méthode Vyxo 5 Steps', 'Diagnostic → Cartographie → Standardisation → Automatisation → Pilotage ROI', 'Expert'),
  (v_nicolas_id, 'methods', 'KPI Design', 'Conception de KPIs robustes (définition, périmètre, gouvernance)', 'Expert'),
  (v_nicolas_id, 'methods', 'Data Quality Frameworks', 'Détection erreurs, incohérences Excel, sources multiples', 'Expert'),

  (v_nicolas_id, 'softSkills', 'Pédagogie', 'Pédagogie avec les DAF et opérationnels', 'Expert'),
  (v_nicolas_id, 'softSkills', 'Vulgarisation Data', 'Capacité à vulgariser la data', 'Expert'),
  (v_nicolas_id, 'softSkills', 'Rigueur Business', 'Rigueur analytique et sens business', 'Expert');

  -- Impacts (Nicolas)
  insert into vch_codir_impacts (member_id, type, content) values
  (v_nicolas_id, 'strength', 'Réduction drastique du temps de reporting (jusqu’à -90%)'),
  (v_nicolas_id, 'strength', 'Amélioration de la précision des prévisions (+30% de précision forecast)'),
  (v_nicolas_id, 'strength', 'Construction de systèmes financiers “augmentés” par l’IA'),
  (v_nicolas_id, 'impact_zone', 'Directions financières d’ETI / groupes'),
  (v_nicolas_id, 'impact_zone', 'Environnements complexes multi-pays'),
  (v_nicolas_id, 'impact_zone', 'Projets de transformation du reporting et de la qualité de la donnée financière'),
  (v_nicolas_id, 'result', '-90% sur le temps de reporting grâce à l’automatisation'),
  (v_nicolas_id, 'result', '+30% de précision sur les forecasts'),
  (v_nicolas_id, 'result', '100% de fiabilité sur les jeux de données critiques dans certains contextes clients');


  -- 3. WYSSAM HOUSSEINE
  insert into vch_codir_members (id, name, role, mission, long_bio, portfolio_url, quote)
  values (
    v_wyssam_id,
    'Wyssam Housseine',
    'Senior Operations Consultant | Expert Cold Chain & Excellence Opérationnelle | Partner Vyxo Consulting',
    'Transformer les opérations logistiques complexes (pharma, agro, chaîne du froid) en leviers de performance mesurable ET certifiée, en combinant GDP/HACCP/ISO avec productivité, climat social et rentabilité.',
    'Wyssam est un profil 100% terrain. Il a dirigé des agences logistiques de plus de 120 personnes, géré des flux de 500 tonnes par jour, et piloté des opérations critiques (notamment vaccins pour Santé Publique France). Son expertise couvre la GDP, la chaîne du froid, la logistique pharmaceutique, les TMS, et la mise à niveau d’agences en difficulté. Il sait parler aussi bien aux chauffeurs et préparateurs qu’aux directeurs financiers.',
    '',
    '"On ne gère pas une chaîne du froid avec des PowerPoints, mais avec des process qui tiennent sur le terrain."'
  );

  insert into vch_codir_competencies (member_id, category, label, description, level) values
  (v_wyssam_id, 'operations', 'Direction Agence', 'Direction d’agence (120+ collaborateurs)', 'Expert'),
  (v_wyssam_id, 'operations', 'Gestion Flux', 'Gestion de flux jusqu’à 500 t/j', 'Expert'),
  (v_wyssam_id, 'operations', 'Quais & Tournées', 'Organisation des quais, tournées, livraisons, enlèvements', 'Expert'),
  (v_wyssam_id, 'operations', 'Last Mile Optimization', 'Optimisation du dernier kilomètre', 'Expert'),

  (v_wyssam_id, 'quality', 'Plans CAPA', 'Mise en œuvre de plans CAPA avec ROI', 'Expert'),
  (v_wyssam_id, 'quality', 'Audit Terrain', 'Audit terrain complet (entrepôts, tournées, process opératoires)', 'Expert'),

  (v_wyssam_id, 'norms', 'GDP', 'Good Distribution Practice – pharma', 'Expert'),
  (v_wyssam_id, 'norms', 'HACCP & ISO 22000', 'Sécurité alimentaire', 'Expert'),
  (v_wyssam_id, 'norms', 'ISO 9001', 'Management de la qualité', 'Expert'),

  (v_wyssam_id, 'tech', 'TMS Deployment', 'Déploiement de TMS (ex: TEOS)', 'Avancé'),
  (v_wyssam_id, 'tech', 'Traçabilité & Temp', 'Utilisation des outils de traçabilité et de suivi température', 'Expert'),

  (v_wyssam_id, 'methods', 'Diag Terrain & Perf', 'Diagnostic terrain → Cartographie → Standardisation → KPIs → Management', 'Expert'),
  (v_wyssam_id, 'methods', 'Regulatory & Cost Mix', 'Approche mêlant conformité réglementaire et optimisation des coûts', 'Expert'),

  (v_wyssam_id, 'softSkills', 'Climat Social', 'Capacité à améliorer le climat social', 'Expert'),
  (v_wyssam_id, 'softSkills', 'Leadership Proximité', 'Leadership de proximité', 'Expert'),
  (v_wyssam_id, 'softSkills', 'Communication 360', 'Discours crédible du quai à la direction', 'Expert');

  insert into vch_codir_impacts (member_id, type, content) values
  (v_wyssam_id, 'strength', 'Compréhension très fine de la chaîne du froid et des risques de rupture'),
  (v_wyssam_id, 'strength', 'Capacité à redresser une agence ou un site en difficulté'),
  (v_wyssam_id, 'strength', 'Vision terrain + conformité + performance'),
  (v_wyssam_id, 'impact_zone', 'Transporteurs pharma'),
  (v_wyssam_id, 'impact_zone', 'Logistique agroalimentaire'),
  (v_wyssam_id, 'impact_zone', 'Hubs et agences avec enjeux de Cold Chain et de qualité de service'),
  (v_wyssam_id, 'result', 'Gestion réussie de sites complexes (Eurotranspharma, GEODIS, Olano)'),
  (v_wyssam_id, 'result', 'Projets vaccin SPF avec exigences extrêmes de fiabilité');


  -- 4. RAFAEL MOREIRA FERREIRA
  insert into vch_codir_members (id, name, role, mission, long_bio, portfolio_url, quote)
  values (
    v_rafael_id,
    'Rafael Moreira Ferreira',
    'Senior Process & Quality Manager | Lean Six Sigma Black Belt',
    'Structurer les processus industriels et les systèmes de management intégrés (SGI) pour garantir l’excellence opérationnelle, les certifications internationales et la réduction de la non-qualité.',
    'Rafael est un architecte SGI international. Il a travaillé au Brésil, en France et aux USA, en accompagnant des entreprises sur l’ISO 9001, 14001, 45001 et IATF 16949. Black Belt Lean Six Sigma, il est capable de passer de la modélisation de processus BPMN à la mise en œuvre d’actions lean très concrètes sur le terrain. Il a un track record solide en amélioration de la satisfaction client, fiabilisation d’inventaire et réduction de réclamations.',
    '',
    '"La norme est un langage. Je l’utilise pour faire parler la performance."'
  );

  insert into vch_codir_competencies (member_id, category, label, description, level) values
  (v_rafael_id, 'quality', 'SGI', 'Systèmes de Management Intégrés (SGI)', 'Expert'),
  (v_rafael_id, 'quality', 'ISO 9001', 'Qualité', 'Expert'),
  (v_rafael_id, 'quality', 'ISO 14001', 'Environnement', 'Expert'),
  (v_rafael_id, 'quality', 'ISO 45001', 'Santé & Sécurité au travail', 'Expert'),
  (v_rafael_id, 'quality', 'IATF 16949', 'Automobile', 'Expert'),

  (v_rafael_id, 'operations', 'KPIs / SLAs', 'Mise en place de KPIs / SLAs', 'Expert'),
  (v_rafael_id, 'operations', 'Critical Process Design', 'Structuration de processus critiques', 'Expert'),

  (v_rafael_id, 'tech', 'SGQ Digital', 'Digitalisation de systèmes Qualité (SGQ digitalisés)', 'Avancé'),

  (v_rafael_id, 'norms', 'Normes ISO Audit', 'Maîtrise approfondie des référentiels ISO et exigences d’audit', 'Expert'),

  (v_rafael_id, 'methods', 'Lean Six Sigma', 'Lean Six Sigma Black Belt', 'Expert'),
  (v_rafael_id, 'methods', '5S', '5S', 'Expert'),
  (v_rafael_id, 'methods', 'FMEA', 'FMEA (Analyse des modes de défaillance)', 'Expert'),
  (v_rafael_id, 'methods', 'VSM', 'Value Stream Mapping (VSM)', 'Expert'),
  (v_rafael_id, 'methods', 'BPMN', 'BPMN (modélisation de processus complexes)', 'Expert'),
  (v_rafael_id, 'methods', 'Run at Rate', 'Validation de capacité industrielle', 'Expert'),
  (v_rafael_id, 'methods', '5 Steps SGI', 'Diagnostic → BPMN → Implémentation SGI → Audit → Lean Six Sigma', 'Expert'),

  (v_rafael_id, 'softSkills', 'Adaptabilité Culturelle', 'Capacité à s’adapter aux cultures (Brésil / France / USA)', 'Expert'),
  (v_rafael_id, 'softSkills', 'Rigueur & Flexibilité', 'Rigueur technique + flexibilité humaine', 'Expert'),
  (v_rafael_id, 'softSkills', 'Pédagogie Change', 'Pédagogie dans la mise en place du changement', 'Expert');

  insert into vch_codir_impacts (member_id, type, content) values
  (v_rafael_id, 'strength', 'Rendre les normes ISO concrètes, utiles, pas juste “papier”'),
  (v_rafael_id, 'strength', 'Combiner conformité & réduction des coûts'),
  (v_rafael_id, 'impact_zone', 'Industrie (manufacturing, automotive, services industriels)'),
  (v_rafael_id, 'impact_zone', 'Entreprises cherchant certification ou recertification'),
  (v_rafael_id, 'impact_zone', 'Multi-sites et environnements multiculturels'),
  (v_rafael_id, 'result', 'NPS : 15% → 72%'),
  (v_rafael_id, 'result', 'Inventaire : 89% → 99% de fiabilité'),
  (v_rafael_id, 'result', 'Réclamations : 0 sur 3 clients majeurs'),
  (v_rafael_id, 'result', 'Réduction de coûts de non-qualité via digitalisation du SGQ');


  -- 5. AURORE CHARDON
  insert into vch_codir_members (id, name, role, mission, long_bio, portfolio_url, quote)
  values (
    v_aurore_id,
    'Aurore Chardon',
    'Partner Growth & Execution | Business & Emotional Conductor',
    'Développer le business Vyxo en tant qu’apporteuse d’affaires, co-construire la stratégie de croissance, orchestrer l’exécution des projets, stabiliser la vision du CEO et servir de n°2 opérationnelle dans l’organisation.',
    'Aurore a un background solide en commerce et vente de logiciels. Elle comprend les cycles de vente B2B, la prospection, le closing, et les enjeux de relation client long terme. Dans Vyxo, elle tient un rôle clé : elle est à la fois apport d’affaires, stratège de croissance, coordinatrice entre les projets, et régulatrice émotionnelle / opérationnelle auprès du CEO. Elle sert de chef d’orchestre entre les pôles Finance, Ops, Qualité, Produits, et veille à ce que la vision soit alignée avec la capacité opérationnelle.',
    '',
    '"Sans orchestration, même les meilleurs solistes finissent par jouer faux."'
  );

  insert into vch_codir_competencies (member_id, category, label, description, level) values
  (v_aurore_id, 'commercial', 'Prospection B2B', 'Prospection B2B', 'Expert'),
  (v_aurore_id, 'commercial', 'Solution Selling', 'Vente de solutions (dont logiciels)', 'Expert'),
  (v_aurore_id, 'commercial', 'Pipeline Management', 'Gestion de pipeline', 'Expert'),
  (v_aurore_id, 'commercial', 'Closing & Relation', 'Closing & suivi relationnel', 'Expert'),

  (v_aurore_id, 'operations', 'Coordination Multi-Projets', 'Coordination multi-projets Vyxo', 'Expert'),
  (v_aurore_id, 'operations', 'Interface Pôles', 'Interface entre différents pôles et partenaires', 'Expert'),
  (v_aurore_id, 'operations', 'Agenda Stratégique', 'Gestion de priorités et structuration de l’agenda stratégique', 'Expert'),

  (v_aurore_id, 'methods', 'Stratégie Commerciale', 'Construction de stratégie de développement commercial', 'Expert'),
  (v_aurore_id, 'methods', 'Rituels Exécution', 'Mise en place de routines et rituels d’exécution', 'Expert'),
  (v_aurore_id, 'methods', 'Cycle Exécution', 'Focus → Priorisation → Exécution → Feedback → Ajustement', 'Expert'),

  (v_aurore_id, 'softSkills', 'Régulation Émotionnelle', 'Régulation émotionnelle du CEO', 'Expert'),
  (v_aurore_id, 'softSkills', 'Recadrage Focus', 'Capacité à recadrer / recentrer lorsqu’il y a dispersion', 'Expert'),
  (v_aurore_id, 'softSkills', 'Intelligence Relationnelle', 'Intelligence relationnelle élevée', 'Expert'),
  (v_aurore_id, 'softSkills', 'Team Harmony', 'Sens de l’harmonie dans les équipes', 'Expert');

  insert into vch_codir_impacts (member_id, type, content) values
  (v_aurore_id, 'strength', 'Transformation d’idées en plans d’action concrets'),
  (v_aurore_id, 'strength', 'Capacité à équilibrer ambition et faisabilité'),
  (v_aurore_id, 'strength', 'Apport de deals + structuration de la machine commerciale'),
  (v_aurore_id, 'impact_zone', 'Développement commercial Vyxo'),
  (v_aurore_id, 'impact_zone', 'Alignement stratégie / capacité réelle de livraison'),
  (v_aurore_id, 'impact_zone', 'Coordination entre Nicolas, Wyssam, Rafael et Vivien'),
  (v_aurore_id, 'result', 'Construction du rôle de n°2 opérationnelle'),
  (v_aurore_id, 'result', 'Mise en place d’une dynamique de croissance structurée');

end $$;
