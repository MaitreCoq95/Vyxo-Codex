-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Table: vch_idea_bucket
-- Stores all ideas submitted by the team.
create table if not exists vch_idea_bucket (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category text not null, -- Consulting, SaaS, Hardware, etc.
  subcategory text, -- Cold Chain, ISO, etc.
  status text not null default 'idea', -- idea, under_review, approved, rejected, converted_to_project
  
  -- Scoring / Evaluation
  strategic_fit int check (strategic_fit between 1 and 5),
  business_potential int check (business_potential between 1 and 5),
  complexity int check (complexity between 1 and 5),
  risk_level int check (risk_level between 1 and 5),
  time_horizon text, -- court terme, moyen terme, long terme
  notes_internal text,

  -- Authorship
  created_by uuid references vch_codir_members(id), -- Nullable if we allow external submissions later, but for now linked to member
  
  -- Link to project if converted
  converted_project_id uuid, -- Will reference vch_projects(id) but we create table later, so add FK constraint alter table or just leave loose for now to avoid circular creation issues. Actually we can create projects first or bucket first. Let's add constraint later or just rely on logic. We'll leave it as simple UUID for the create statement and add FK if needed.
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Table: vch_idea_votes
-- Stores votes from Codir members on ideas.
create table if not exists vch_idea_votes (
  id uuid primary key default uuid_generate_v4(),
  idea_id uuid references vch_idea_bucket(id) on delete cascade,
  member_id uuid references vch_codir_members(id) on delete cascade,
  vote text not null check (vote in ('yes', 'no', 'abstain')),
  comment text,
  created_at timestamptz default now(),
  unique(idea_id, member_id) -- One vote per member per idea
);

-- 3. Table: vch_projects
-- Stores ideas that became actual projects.
create table if not exists vch_projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category text not null,
  subcategory text,
  status text not null default 'draft', -- draft, discovery, design, build, launch, live, parked, archived
  
  origin_idea_id uuid references vch_idea_bucket(id) on delete set null,
  
  owner_id uuid references vch_codir_members(id),
  codir_sponsor_ids uuid[], -- Array of sponsor IDs
  
  -- Business & Planning
  expected_revenue numeric,
  expected_profit numeric,
  effort_estimation text, -- low, medium, high
  priority text, -- low, medium, high, critical
  time_horizon text, -- 0-3 mois, 3-12 mois, >12 mois
  
  -- KPIs
  kpi_main text,
  kpi_target text,
  kpi_current text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add the Circular FK for converted_project_id now that vch_projects exists
alter table vch_idea_bucket 
add constraint fk_idea_project 
foreign key (converted_project_id) 
references vch_projects(id);
