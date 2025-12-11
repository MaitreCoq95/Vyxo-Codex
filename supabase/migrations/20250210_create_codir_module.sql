-- =====================================================
-- VYXO CODIR MODULE - COMPLETE DATABASE SCHEMA
-- =====================================================
-- Module de pilotage CODIR : Réunions, Décisions, Actions, Projets, Roadmap, KPIs
-- Date: 2025-02-10
-- =====================================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- =====================================================
-- TABLE: codir_reunions
-- =====================================================
-- Stores all CODIR meeting information
create table if not exists codir_reunions (
  id uuid primary key default uuid_generate_v4(),
  date date not null,
  titre text not null,
  lieu text,
  participants text[] default '{}', -- Array of participant names/IDs
  objectifs text,
  points_discutes text,
  synthese text,
  prochaines_etapes text,
  statut text default 'planifiee', -- planifiee, en_cours, terminee
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
-- TABLE: codir_decisions
-- =====================================================
-- Strategic decisions taken during CODIR meetings
create table if not exists codir_decisions (
  id uuid primary key default uuid_generate_v4(),
  reunion_id uuid references codir_reunions(id) on delete cascade,
  titre text not null,
  description text,
  responsable text not null,
  impact text default 'medium', -- low, medium, high
  theme text not null, -- Produit, Finance, Commercial, Ops, Organisation, Tech
  etat text default 'idee', -- idee, validee, en_cours, terminee, abandonnee
  priorite integer default 2, -- 1=haute, 2=moyenne, 3=basse
  date_decision date default current_date,
  date_echeance date,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
-- TABLE: codir_actions
-- =====================================================
-- Action items derived from decisions
create table if not exists codir_actions (
  id uuid primary key default uuid_generate_v4(),
  decision_id uuid references codir_decisions(id) on delete cascade,
  reunion_id uuid references codir_reunions(id) on delete cascade,
  description text not null,
  responsable text not null,
  deadline date,
  etat text default 'pending', -- pending, in_progress, completed, blocked
  priorite integer default 2, -- 1=haute, 2=moyenne, 3=basse
  notes text,
  pourcentage_avancement integer default 0 check (pourcentage_avancement >= 0 and pourcentage_avancement <= 100),
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  completed_at timestamptz
);

-- =====================================================
-- TABLE: codir_projets
-- =====================================================
-- Projects originating from CODIR decisions
create table if not exists codir_projets (
  id uuid primary key default uuid_generate_v4(),
  decision_source uuid references codir_decisions(id) on delete set null,
  nom text not null,
  objectif text,
  description text,
  responsable text not null,
  equipe text[] default '{}', -- Team members
  kpi text,
  budget decimal(15,2),
  avancement integer default 0 check (avancement >= 0 and avancement <= 100),
  deadline date,
  date_debut date default current_date,
  risques text,
  etat text default 'en_cours', -- en_cours, termine, suspendu, annule
  priorite integer default 2,
  tags text[] default '{}',
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
-- TABLE: codir_subtasks
-- =====================================================
-- Subtasks for projects (enables progress tracking)
create table if not exists codir_subtasks (
  id uuid primary key default uuid_generate_v4(),
  projet_id uuid references codir_projets(id) on delete cascade,
  description text not null,
  responsable text,
  etat text default 'pending', -- pending, in_progress, completed
  deadline date,
  ordre integer default 0, -- For ordering subtasks
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  completed_at timestamptz
);

-- =====================================================
-- TABLE: codir_kpis
-- =====================================================
-- Strategic KPIs tracked by CODIR
create table if not exists codir_kpis (
  id uuid primary key default uuid_generate_v4(),
  periode date not null, -- Month/Quarter/Year reference
  type_periode text default 'month', -- month, quarter, year

  -- Decisions metrics
  decisions_prises integer default 0,
  decisions_validees integer default 0,
  decisions_terminees integer default 0,
  taux_transformation decimal(5,2), -- % decisions -> actions

  -- Projects metrics
  projets_actifs integer default 0,
  projets_termines integer default 0,
  avancement_global decimal(5,2), -- Average project progress

  -- Actions metrics
  actions_assignees integer default 0,
  actions_completees integer default 0,
  taux_completion_actions decimal(5,2),

  -- Business metrics (can be manually entered or synced from other modules)
  diagnostics_vendus integer default 0,
  scores_codex_generes integer default 0,
  abonnements_uniq integer default 0,
  ca_mensuel decimal(15,2),

  -- Capacity metrics
  charge_projets decimal(5,2), -- % capacity used
  capacite_disponible decimal(5,2), -- % capacity available

  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Ensure one KPI snapshot per period
  unique(periode, type_periode)
);

-- =====================================================
-- TABLE: codir_templates
-- =====================================================
-- Internal templates for meetings, decisions, etc.
create table if not exists codir_templates (
  id uuid primary key default uuid_generate_v4(),
  nom text not null,
  type text not null, -- cr, decision, action, projet, business_plan, pitch
  description text,
  contenu_markdown text not null,
  contenu_json jsonb,
  is_default boolean default false,
  tags text[] default '{}',
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

-- Reunions indexes
create index idx_codir_reunions_date on codir_reunions(date desc);
create index idx_codir_reunions_statut on codir_reunions(statut);

-- Decisions indexes
create index idx_codir_decisions_reunion on codir_decisions(reunion_id);
create index idx_codir_decisions_etat on codir_decisions(etat);
create index idx_codir_decisions_theme on codir_decisions(theme);
create index idx_codir_decisions_responsable on codir_decisions(responsable);
create index idx_codir_decisions_echeance on codir_decisions(date_echeance);

-- Actions indexes
create index idx_codir_actions_decision on codir_actions(decision_id);
create index idx_codir_actions_reunion on codir_actions(reunion_id);
create index idx_codir_actions_etat on codir_actions(etat);
create index idx_codir_actions_responsable on codir_actions(responsable);
create index idx_codir_actions_deadline on codir_actions(deadline);

-- Projets indexes
create index idx_codir_projets_decision on codir_projets(decision_source);
create index idx_codir_projets_etat on codir_projets(etat);
create index idx_codir_projets_responsable on codir_projets(responsable);
create index idx_codir_projets_deadline on codir_projets(deadline);

-- Subtasks indexes
create index idx_codir_subtasks_projet on codir_subtasks(projet_id);
create index idx_codir_subtasks_etat on codir_subtasks(etat);

-- KPIs indexes
create index idx_codir_kpis_periode on codir_kpis(periode desc);
create index idx_codir_kpis_type on codir_kpis(type_periode);

-- Templates indexes
create index idx_codir_templates_type on codir_templates(type);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply update trigger to all tables
create trigger update_codir_reunions_updated_at before update on codir_reunions
  for each row execute function update_updated_at_column();

create trigger update_codir_decisions_updated_at before update on codir_decisions
  for each row execute function update_updated_at_column();

create trigger update_codir_actions_updated_at before update on codir_actions
  for each row execute function update_updated_at_column();

create trigger update_codir_projets_updated_at before update on codir_projets
  for each row execute function update_updated_at_column();

create trigger update_codir_subtasks_updated_at before update on codir_subtasks
  for each row execute function update_updated_at_column();

create trigger update_codir_kpis_updated_at before update on codir_kpis
  for each row execute function update_updated_at_column();

create trigger update_codir_templates_updated_at before update on codir_templates
  for each row execute function update_updated_at_column();

-- =====================================================
-- Function to calculate project progress from subtasks
-- =====================================================
create or replace function calculate_project_progress(p_project_id uuid)
returns integer as $$
declare
  v_total_tasks integer;
  v_completed_tasks integer;
  v_progress integer;
begin
  select count(*) into v_total_tasks
  from codir_subtasks
  where projet_id = p_project_id;

  if v_total_tasks = 0 then
    return 0;
  end if;

  select count(*) into v_completed_tasks
  from codir_subtasks
  where projet_id = p_project_id and etat = 'completed';

  v_progress := round((v_completed_tasks::decimal / v_total_tasks::decimal) * 100);

  -- Update project progress
  update codir_projets
  set avancement = v_progress
  where id = p_project_id;

  return v_progress;
end;
$$ language plpgsql;

-- =====================================================
-- Function to auto-calculate KPIs for a period
-- =====================================================
create or replace function calculate_codir_kpis(p_periode date, p_type_periode text default 'month')
returns uuid as $$
declare
  v_kpi_id uuid;
  v_decisions_prises integer;
  v_decisions_validees integer;
  v_decisions_terminees integer;
  v_taux_transformation decimal(5,2);
  v_projets_actifs integer;
  v_projets_termines integer;
  v_avancement_global decimal(5,2);
  v_actions_assignees integer;
  v_actions_completees integer;
  v_taux_completion decimal(5,2);
begin
  -- Count decisions
  select count(*) into v_decisions_prises
  from codir_decisions
  where date_decision >= p_periode and date_decision < p_periode + interval '1 month';

  select count(*) into v_decisions_validees
  from codir_decisions
  where date_decision >= p_periode and date_decision < p_periode + interval '1 month'
    and etat = 'validee';

  select count(*) into v_decisions_terminees
  from codir_decisions
  where date_decision >= p_periode and date_decision < p_periode + interval '1 month'
    and etat = 'terminee';

  -- Count projects
  select count(*) into v_projets_actifs
  from codir_projets
  where etat = 'en_cours';

  select count(*) into v_projets_termines
  from codir_projets
  where etat = 'termine'
    and updated_at >= p_periode and updated_at < p_periode + interval '1 month';

  -- Average project progress
  select coalesce(avg(avancement), 0) into v_avancement_global
  from codir_projets
  where etat = 'en_cours';

  -- Count actions
  select count(*) into v_actions_assignees
  from codir_actions
  where created_at >= p_periode and created_at < p_periode + interval '1 month';

  select count(*) into v_actions_completees
  from codir_actions
  where etat = 'completed'
    and completed_at >= p_periode and completed_at < p_periode + interval '1 month';

  -- Calculate rates
  if v_decisions_prises > 0 then
    v_taux_transformation := round((v_actions_assignees::decimal / v_decisions_prises::decimal) * 100, 2);
  else
    v_taux_transformation := 0;
  end if;

  if v_actions_assignees > 0 then
    v_taux_completion := round((v_actions_completees::decimal / v_actions_assignees::decimal) * 100, 2);
  else
    v_taux_completion := 0;
  end if;

  -- Insert or update KPI snapshot
  insert into codir_kpis (
    periode, type_periode,
    decisions_prises, decisions_validees, decisions_terminees, taux_transformation,
    projets_actifs, projets_termines, avancement_global,
    actions_assignees, actions_completees, taux_completion_actions
  )
  values (
    p_periode, p_type_periode,
    v_decisions_prises, v_decisions_validees, v_decisions_terminees, v_taux_transformation,
    v_projets_actifs, v_projets_termines, v_avancement_global,
    v_actions_assignees, v_actions_completees, v_taux_completion
  )
  on conflict (periode, type_periode) do update set
    decisions_prises = excluded.decisions_prises,
    decisions_validees = excluded.decisions_validees,
    decisions_terminees = excluded.decisions_terminees,
    taux_transformation = excluded.taux_transformation,
    projets_actifs = excluded.projets_actifs,
    projets_termines = excluded.projets_termines,
    avancement_global = excluded.avancement_global,
    actions_assignees = excluded.actions_assignees,
    actions_completees = excluded.actions_completees,
    taux_completion_actions = excluded.taux_completion_actions
  returning id into v_kpi_id;

  return v_kpi_id;
end;
$$ language plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
alter table codir_reunions enable row level security;
alter table codir_decisions enable row level security;
alter table codir_actions enable row level security;
alter table codir_projets enable row level security;
alter table codir_subtasks enable row level security;
alter table codir_kpis enable row level security;
alter table codir_templates enable row level security;

-- Policies: Allow authenticated users to read all
create policy "Allow read for authenticated users" on codir_reunions
  for select using (auth.role() = 'authenticated');

create policy "Allow read for authenticated users" on codir_decisions
  for select using (auth.role() = 'authenticated');

create policy "Allow read for authenticated users" on codir_actions
  for select using (auth.role() = 'authenticated');

create policy "Allow read for authenticated users" on codir_projets
  for select using (auth.role() = 'authenticated');

create policy "Allow read for authenticated users" on codir_subtasks
  for select using (auth.role() = 'authenticated');

create policy "Allow read for authenticated users" on codir_kpis
  for select using (auth.role() = 'authenticated');

create policy "Allow read for authenticated users" on codir_templates
  for select using (auth.role() = 'authenticated');

-- Policies: Allow authenticated users to insert/update/delete
create policy "Allow all for authenticated users" on codir_reunions
  for all using (auth.role() = 'authenticated');

create policy "Allow all for authenticated users" on codir_decisions
  for all using (auth.role() = 'authenticated');

create policy "Allow all for authenticated users" on codir_actions
  for all using (auth.role() = 'authenticated');

create policy "Allow all for authenticated users" on codir_projets
  for all using (auth.role() = 'authenticated');

create policy "Allow all for authenticated users" on codir_subtasks
  for all using (auth.role() = 'authenticated');

create policy "Allow all for authenticated users" on codir_kpis
  for all using (auth.role() = 'authenticated');

create policy "Allow all for authenticated users" on codir_templates
  for all using (auth.role() = 'authenticated');

-- =====================================================
-- SEED DATA: Default Templates
-- =====================================================

-- Template: Compte Rendu
insert into codir_templates (nom, type, description, contenu_markdown, is_default)
values (
  'Template Compte Rendu CODIR',
  'cr',
  'Template par défaut pour les comptes rendus de réunion CODIR',
  '# Compte Rendu CODIR - [Date]

## 📋 Informations

- **Date**: [Date de la réunion]
- **Lieu**: [Lieu/Visio]
- **Participants**: [Liste des participants]

## 🎯 Objectifs de la réunion

[Décrire les objectifs principaux]

## 💬 Points discutés

### Point 1: [Titre]
[Discussion et éléments clés]

### Point 2: [Titre]
[Discussion et éléments clés]

## ✅ Décisions prises

1. **[Décision 1]** - Responsable: [Nom] - Échéance: [Date]
2. **[Décision 2]** - Responsable: [Nom] - Échéance: [Date]

## 🚀 Actions à mener

| Action | Responsable | Échéance | Priorité |
|--------|-------------|----------|----------|
| [Action 1] | [Nom] | [Date] | Haute |
| [Action 2] | [Nom] | [Date] | Moyenne |

## 📊 KPIs / Indicateurs discutés

[Indicateurs et métriques abordés]

## ⚠️ Risques identifiés

[Risques et points d''attention]

## 📅 Prochaines étapes

[Prochaine réunion, jalons importants]

---
*Rédigé le [Date] par [Nom]*',
  true
);

-- Template: Décision
insert into codir_templates (nom, type, description, contenu_markdown, is_default)
values (
  'Template Décision Stratégique',
  'decision',
  'Template pour documenter une décision stratégique',
  '# Décision: [Titre de la décision]

## 📝 Contexte

[Pourquoi cette décision est nécessaire]

## 🎯 Décision prise

[Décrire la décision en détail]

## 💡 Impact attendu

- **Impact**: [Low/Medium/High]
- **Thème**: [Produit/Finance/Commercial/Ops/Organisation/Tech]
- **Bénéfices attendus**: [Liste des bénéfices]

## 👤 Responsabilités

- **Responsable**: [Nom]
- **Équipe**: [Liste des personnes impliquées]

## 📅 Échéancier

- **Date de décision**: [Date]
- **Échéance**: [Date limite]

## 📊 Critères de succès

[Comment mesurer le succès de cette décision]

## ⚠️ Risques et mitigation

[Risques identifiés et actions de mitigation]

---
*Décision validée en CODIR le [Date]*',
  true
);

-- Template: Action
insert into codir_templates (nom, type, description, contenu_markdown, is_default)
values (
  'Template Action Item',
  'action',
  'Template pour une action à mener',
  '# Action: [Titre de l''action]

## 📝 Description

[Description détaillée de l''action à mener]

## 👤 Responsable

- **Assigné à**: [Nom]
- **Support**: [Personnes pouvant aider]

## 📅 Échéance

- **Date limite**: [Date]
- **Priorité**: [Haute/Moyenne/Basse]

## ✅ Critères de validation

- [ ] [Critère 1]
- [ ] [Critère 2]
- [ ] [Critère 3]

## 🔗 Liens

- Décision source: [Lien]
- Projet associé: [Lien]

## 📊 Statut

- [x] Pending
- [ ] In Progress
- [ ] Completed
- [ ] Blocked

---
*Créée le [Date]*',
  true
);

-- Template: Projet
insert into codir_templates (nom, type, description, contenu_markdown, is_default)
values (
  'Template Projet CODIR',
  'projet',
  'Template pour initialiser un projet issu du CODIR',
  '# Projet: [Nom du projet]

## 🎯 Objectif

[Décrire l''objectif métier du projet]

## 📝 Description

[Description complète du projet]

## 👥 Équipe

- **Responsable**: [Nom]
- **Équipe**: [Liste des membres]

## 📊 KPI

[Indicateurs de succès du projet]

## 📅 Planning

- **Date de début**: [Date]
- **Date de fin prévue**: [Date]
- **Jalons clés**:
  - [Jalon 1] - [Date]
  - [Jalon 2] - [Date]

## 💰 Budget

[Budget alloué]

## ✅ Tâches principales

- [ ] [Tâche 1]
- [ ] [Tâche 2]
- [ ] [Tâche 3]

## ⚠️ Risques

[Risques identifiés et plan de mitigation]

## 🔗 Origine

- Décision CODIR: [Lien]
- Réunion: [Date et lien]

---
*Projet initialisé le [Date]*',
  true
);

-- =====================================================
-- COMMENTS
-- =====================================================

comment on table codir_reunions is 'Réunions du CODIR avec participants, objectifs et synthèses';
comment on table codir_decisions is 'Décisions stratégiques prises en CODIR';
comment on table codir_actions is 'Actions issues des décisions CODIR';
comment on table codir_projets is 'Projets lancés suite aux décisions CODIR';
comment on table codir_subtasks is 'Sous-tâches des projets pour tracking fin';
comment on table codir_kpis is 'KPIs stratégiques du CODIR par période';
comment on table codir_templates is 'Templates internes pour CR, décisions, actions, projets';

-- =====================================================
-- END OF MIGRATION
-- =====================================================
