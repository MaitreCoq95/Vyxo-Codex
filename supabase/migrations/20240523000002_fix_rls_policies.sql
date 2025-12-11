-- =============================================
-- VYXO CORE - FIX RLS POLICIES (DEMO MODE)
-- =============================================
-- Ce script remplace les politiques strictes par des politiques permissives
-- pour permettre le mode démo sans authentification stricte.

-- 1. Drop existing strict policies
DROP POLICY IF EXISTS "Enable all for authenticated" ON vch_audits;
DROP POLICY IF EXISTS "Enable all for authenticated" ON vch_audit_checklists;
DROP POLICY IF EXISTS "Enable all for authenticated" ON vch_audit_checklist_items;
DROP POLICY IF EXISTS "Enable all for authenticated" ON vch_audit_findings;
DROP POLICY IF EXISTS "Enable all for authenticated" ON vch_audit_evidence;
DROP POLICY IF EXISTS "Enable all for authenticated" ON vch_non_conformities;
DROP POLICY IF EXISTS "Enable all for authenticated" ON vch_capa;
DROP POLICY IF EXISTS "Enable all for authenticated" ON vch_audit_reports;
DROP POLICY IF EXISTS "Enable all for authenticated" ON vch_audit_express_responses;

-- 2. Create permissive policies (Public Access for Demo)
-- WARNING: This allows anyone to read/write. For production, revert to authenticated only.

CREATE POLICY "Enable all for everyone" ON vch_audits FOR ALL USING (true);
CREATE POLICY "Enable all for everyone" ON vch_audit_checklists FOR ALL USING (true);
CREATE POLICY "Enable all for everyone" ON vch_audit_checklist_items FOR ALL USING (true);
CREATE POLICY "Enable all for everyone" ON vch_audit_findings FOR ALL USING (true);
CREATE POLICY "Enable all for everyone" ON vch_audit_evidence FOR ALL USING (true);
CREATE POLICY "Enable all for everyone" ON vch_non_conformities FOR ALL USING (true);
CREATE POLICY "Enable all for everyone" ON vch_capa FOR ALL USING (true);
CREATE POLICY "Enable all for everyone" ON vch_audit_reports FOR ALL USING (true);
CREATE POLICY "Enable all for everyone" ON vch_audit_express_responses FOR ALL USING (true);
