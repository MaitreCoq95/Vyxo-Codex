    -- =============================================
    -- VYXO CORE - RESET AUDIT MODULE
    -- =============================================
    -- ATTENTION : Ce script SUPPRIME toutes les données des tables d'audit
    -- Utilisez-le pour repartir sur une base saine si vous avez des erreurs de migration

    -- 1. Drop tables in correct dependency order
    DROP TABLE IF EXISTS vch_audit_express_responses CASCADE;
    DROP TABLE IF EXISTS vch_audit_reports CASCADE;
    DROP TABLE IF EXISTS vch_capa CASCADE;
    DROP TABLE IF EXISTS vch_non_conformities CASCADE;
    DROP TABLE IF EXISTS vch_audit_evidence CASCADE;
    DROP TABLE IF EXISTS vch_audit_findings CASCADE;
    DROP TABLE IF EXISTS vch_audit_checklist_items CASCADE;
    DROP TABLE IF EXISTS vch_audit_checklists CASCADE;
    DROP TABLE IF EXISTS vch_audits CASCADE;

    -- 2. Re-create tables (Clean Schema)

    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- AUDITS
    CREATE TABLE vch_audits (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        reference_number TEXT UNIQUE NOT NULL,
        client_id UUID NOT NULL,
        title TEXT NOT NULL,
        scope TEXT,
        objectives TEXT,
        criteria TEXT[], 
        status TEXT NOT NULL CHECK (status IN ('planned', 'in_progress', 'review', 'completed', 'archived')),
        type TEXT NOT NULL CHECK (type IN ('internal', 'external', 'certification', 'supplier')),
        auditor_id UUID NOT NULL,
        planned_date TIMESTAMP WITH TIME ZONE,
        start_date TIMESTAMP WITH TIME ZONE,
        end_date TIMESTAMP WITH TIME ZONE,
        location TEXT,
        conformity_score NUMERIC(5,2),
        excellence_index NUMERIC(5,2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_by UUID
    );

    -- CHECKLISTS
    CREATE TABLE vch_audit_checklists (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        audit_id UUID REFERENCES vch_audits(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        is_template BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- CHECKLIST ITEMS
    CREATE TABLE vch_audit_checklist_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        checklist_id UUID REFERENCES vch_audit_checklists(id) ON DELETE CASCADE,
        requirement TEXT NOT NULL,
        guidance TEXT,
        reference TEXT,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- FINDINGS
    CREATE TABLE vch_audit_findings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        audit_id UUID NOT NULL REFERENCES vch_audits(id) ON DELETE CASCADE,
        checklist_item_id UUID REFERENCES vch_audit_checklist_items(id),
        type TEXT NOT NULL CHECK (type IN ('conformity', 'observation', 'improvement', 'nc_minor', 'nc_major')),
        description TEXT NOT NULL,
        evidence_notes TEXT,
        site TEXT,
        process TEXT,
        interviewee TEXT,
        severity_score INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_by UUID
    );

    -- EVIDENCE
    CREATE TABLE vch_audit_evidence (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        audit_id UUID NOT NULL REFERENCES vch_audits(id) ON DELETE CASCADE,
        finding_id UUID REFERENCES vch_audit_findings(id) ON DELETE CASCADE,
        file_path TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size INTEGER,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        uploaded_by UUID
    );

    -- NON-CONFORMITIES
    CREATE TABLE vch_non_conformities (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        audit_id UUID NOT NULL REFERENCES vch_audits(id) ON DELETE CASCADE,
        finding_id UUID UNIQUE REFERENCES vch_audit_findings(id),
        client_id UUID NOT NULL,
        reference_number TEXT UNIQUE NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('open', 'root_cause_analysis', 'action_plan', 'implementation', 'verification', 'closed')),
        severity TEXT NOT NULL CHECK (severity IN ('minor', 'major', 'critical')),
        description TEXT NOT NULL,
        requirement TEXT,
        root_cause TEXT,
        root_cause_method TEXT,
        responsible_person TEXT,
        due_date TIMESTAMP WITH TIME ZONE,
        closed_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- CAPA
    CREATE TABLE vch_capa (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nc_id UUID NOT NULL REFERENCES vch_non_conformities(id) ON DELETE CASCADE,
        type TEXT NOT NULL CHECK (type IN ('correction', 'corrective', 'preventive')),
        description TEXT NOT NULL,
        assigned_to UUID,
        status TEXT NOT NULL CHECK (status IN ('planned', 'in_progress', 'completed', 'verified', 'effective', 'ineffective')),
        planned_date TIMESTAMP WITH TIME ZONE,
        completion_date TIMESTAMP WITH TIME ZONE,
        verification_date TIMESTAMP WITH TIME ZONE,
        effectiveness_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- REPORTS
    CREATE TABLE vch_audit_reports (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        audit_id UUID NOT NULL REFERENCES vch_audits(id) ON DELETE CASCADE,
        type TEXT NOT NULL CHECK (type IN ('iso_full', 'vyxo_simplified', 'draft')),
        file_path TEXT NOT NULL,
        version INTEGER DEFAULT 1,
        generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        generated_by UUID
    );

    -- EXPRESS RESPONSES
    CREATE TABLE vch_audit_express_responses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        client_email TEXT,
        company_name TEXT,
        answers JSONB NOT NULL,
        score INTEGER NOT NULL,
        recommendations JSONB,
        converted_to_lead BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- INDEXES
    CREATE INDEX idx_vch_audits_client ON vch_audits(client_id);
    CREATE INDEX idx_vch_audits_status ON vch_audits(status);
    CREATE INDEX idx_vch_findings_audit ON vch_audit_findings(audit_id);
    CREATE INDEX idx_vch_findings_type ON vch_audit_findings(type);
    CREATE INDEX idx_vch_nc_status ON vch_non_conformities(status);
    CREATE INDEX idx_vch_capa_nc ON vch_capa(nc_id);

    -- RLS POLICIES
    ALTER TABLE vch_audits ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Enable all for authenticated" ON vch_audits FOR ALL USING (auth.role() = 'authenticated');

    ALTER TABLE vch_audit_checklists ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Enable all for authenticated" ON vch_audit_checklists FOR ALL USING (auth.role() = 'authenticated');

    ALTER TABLE vch_audit_checklist_items ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Enable all for authenticated" ON vch_audit_checklist_items FOR ALL USING (auth.role() = 'authenticated');

    ALTER TABLE vch_audit_findings ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Enable all for authenticated" ON vch_audit_findings FOR ALL USING (auth.role() = 'authenticated');

    ALTER TABLE vch_audit_evidence ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Enable all for authenticated" ON vch_audit_evidence FOR ALL USING (auth.role() = 'authenticated');

    ALTER TABLE vch_non_conformities ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Enable all for authenticated" ON vch_non_conformities FOR ALL USING (auth.role() = 'authenticated');

    ALTER TABLE vch_capa ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Enable all for authenticated" ON vch_capa FOR ALL USING (auth.role() = 'authenticated');

    ALTER TABLE vch_audit_reports ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Enable all for authenticated" ON vch_audit_reports FOR ALL USING (auth.role() = 'authenticated');

    ALTER TABLE vch_audit_express_responses ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Enable all for authenticated" ON vch_audit_express_responses FOR ALL USING (auth.role() = 'authenticated');
