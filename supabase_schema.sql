-- ==========================================
-- Viyxo Codex Database Schema
-- ==========================================

-- 1. UTILITIES
create extension if not exists "uuid-ossp";

-- ==========================================
-- 2. CRM & CORE BUSINESS ENTITIES
-- ==========================================

-- Clients
create table public.clients (
    id uuid default uuid_generate_v4() primary key,
    organization_id uuid not null, -- Tenant ID
    name text not null,
    siren text,
    sector text,
    status text check (status in ('lead', 'active', 'inactive', 'archived')),
    logo_url text,
    city text,
    country text,
    contact_email text,
    contact_phone text,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Engagements
create table public.engagements (
    id uuid default uuid_generate_v4() primary key,
    organization_id uuid not null,
    client_id uuid references public.clients(id) on delete cascade not null,
    name text not null,
    type text check (type in ('audit', 'consulting', 'training', 'support')),
    status text check (status in ('draft', 'active', 'paused', 'completed', 'cancelled')),
    start_date date,
    end_date date,
    budget_amount numeric,
    currency text default 'EUR',
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Audits
create table public.audits (
    id uuid default uuid_generate_v4() primary key,
    organization_id uuid not null,
    engagement_id uuid references public.engagements(id) on delete cascade not null,
    template_name text,
    template_data jsonb,
    score numeric,
    status text check (status in ('draft', 'in_progress', 'review', 'completed', 'approved')),
    auditor_id uuid references auth.users(id),
    audit_date date,
    findings text,
    recommendations text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Invoices
create table public.invoices (
    id uuid default uuid_generate_v4() primary key,
    organization_id uuid not null,
    engagement_id uuid references public.engagements(id) on delete set null,
    client_id uuid references public.clients(id) on delete cascade not null,
    invoice_number text not null,
    amount numeric not null,
    currency text default 'EUR',
    status text check (status in ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    issue_date date,
    due_date date,
    paid_date date,
    payment_method text,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activities (General Log)
create table public.activities (
    id uuid default uuid_generate_v4() primary key,
    organization_id uuid not null,
    user_id uuid references auth.users(id),
    entity_type text,
    entity_id uuid,
    action text not null,
    description text,
    metadata jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 3. CODEX & GAMIFICATION (Gamification System)
-- ==========================================

-- Codex User XP (Profile)
create table public.codex_user_xp (
    user_id uuid references auth.users(id) primary key,
    total_xp integer default 0,
    level integer default 1,
    badges_earned jsonb default '[]'::jsonb, -- Array of badge IDs
    current_path_id text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Codex Learning Progress (Track paths)
create table public.codex_learning_progress (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    path_id text not null,
    current_step_index integer default 0,
    completed_steps jsonb default '[]'::jsonb, -- Array of step IDs
    xp_earned integer default 0,
    started_at timestamp with time zone default timezone('utc'::text, now()) not null,
    completed_at timestamp with time zone,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, path_id)
);

-- Codex XP History (Log of XP gains)
create table public.codex_xp_history (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    xp_amount integer not null,
    xp_type text, -- e.g. 'QUIZ_COMPLETED', 'STEP_COMPLETED'
    entity_id text,
    entity_type text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Codex Quiz Questions (AI Generated or Manual)
create table public.codex_quiz_questions (
    id text primary key, -- Custom ID format often used by AI generator
    module_id text not null,
    difficulty text check (difficulty in ('easy', 'medium', 'hard')),
    question text not null,
    choices jsonb not null, -- Array of strings
    correct_index integer not null,
    explanation text,
    tags jsonb, -- Array of strings
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
alter table public.clients enable row level security;
alter table public.engagements enable row level security;
alter table public.audits enable row level security;
alter table public.invoices enable row level security;
alter table public.activities enable row level security;
alter table public.codex_user_xp enable row level security;
alter table public.codex_learning_progress enable row level security;
alter table public.codex_xp_history enable row level security;
alter table public.codex_quiz_questions enable row level security;

-- Policies --

-- CODEX : Users can read/write their own data
create policy "Users can view their own XP" on public.codex_user_xp for select using (auth.uid() = user_id);
create policy "Users can insert their own XP" on public.codex_user_xp for insert with check (auth.uid() = user_id);
create policy "Users can update their own XP" on public.codex_user_xp for update using (auth.uid() = user_id);

create policy "Users can view their own progress" on public.codex_learning_progress for select using (auth.uid() = user_id);
create policy "Users can insert their own progress" on public.codex_learning_progress for insert with check (auth.uid() = user_id);
create policy "Users can update their own progress" on public.codex_learning_progress for update using (auth.uid() = user_id);

create policy "Users can view their own history" on public.codex_xp_history for select using (auth.uid() = user_id);
create policy "Users can insert their own history" on public.codex_xp_history for insert with check (auth.uid() = user_id);

-- QUIZ QUESTIONS : Public read (for now), Authenticated insert
create policy "Public read questions" on public.codex_quiz_questions for select using (true);
create policy "Authenticated insert questions" on public.codex_quiz_questions for insert with check (auth.role() = 'authenticated');

-- CRM : Multi-tenancy is based on organization_id. 
-- For simplicity in this script, we assume users have access to all data for now OR matching org_id.
-- Since organization management is complex, we will default to "Authenticated users can read/write all CRM data" 
-- BUT you should restrict this in production based on user's organization.

create policy "Authenticated users full access clients" on public.clients for all using (auth.role() = 'authenticated');
create policy "Authenticated users full access engagements" on public.engagements for all using (auth.role() = 'authenticated');
create policy "Authenticated users full access audits" on public.audits for all using (auth.role() = 'authenticated');
create policy "Authenticated users full access invoices" on public.invoices for all using (auth.role() = 'authenticated');
create policy "Authenticated users full access activities" on public.activities for all using (auth.role() = 'authenticated');

-- Done!
